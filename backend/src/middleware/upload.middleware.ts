import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";

const uploadLargeToCloudinary = (
  filePath: string,
  options: Record<string, any>
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (err: any, result: any) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Custom Multer Storage Engine that streams files to disk temporarily,
// then uploads to Cloudinary with chunked upload_large for large videos/audios,
// avoiding stream truncation and memory issues.
class RobustCloudinaryStorage implements multer.StorageEngine {
  _handleFile(
    _req: any,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): void {
    const ext = path.extname(file.originalname).toLowerCase();
    const tempFileName = `upload_${Date.now()}_${crypto.randomBytes(8).toString("hex")}${ext}`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);

    const outStream = fs.createWriteStream(tempFilePath);
    file.stream.pipe(outStream);

    outStream.on("error", (err) => {
      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      } catch {}
      cb(err);
    });

    outStream.on("finish", async () => {
      if ((file.stream as any)?.truncated || (file as any).truncated) {
        // Stream was truncated by Multer limit (LIMIT_FILE_SIZE)
        try {
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        } catch {}
        return;
      }

      try {
        const fieldname = (file.fieldname || "").toLowerCase();
        const mime = (file.mimetype || "").toLowerCase();
        const isVideo =
          fieldname === "video" ||
          fieldname === "videos" ||
          mime.startsWith("video/") ||
          [
            ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v",
            ".flv", ".wmv", ".3gp", ".ogv", ".ts", ".mts",
            ".m4p", ".mpg", ".mpeg", ".m2v", ".vob",
          ].includes(ext);
        const isAudio =
          fieldname === "backgroundmusic" ||
          fieldname === "audio" ||
          mime.startsWith("audio/") ||
          [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".wma"].includes(ext);

        const stat = fs.existsSync(tempFilePath) ? fs.statSync(tempFilePath) : null;
        const fileSize = stat ? stat.size : 0;

        // Enforce Cloudinary Free Tier limits:
        // - Images: 10MB (10,485,760 bytes)
        // - Videos: 100MB (104,857,600 bytes)
        // - Audio / Raw: 10MB (10,485,760 bytes)
        if (!isVideo && !isAudio && fileSize > 10 * 1024 * 1024) {
          cb(
            new Error(
              `Image "${file.originalname}" is ${(fileSize / (1024 * 1024)).toFixed(1)}MB. Cloudinary maximum allowed image size is 10MB. Please compress or resize the image.`
            )
          );
          return;
        }

        if (isVideo && fileSize > 100 * 1024 * 1024) {
          cb(
            new Error(
              `Video "${file.originalname}" is ${(fileSize / (1024 * 1024)).toFixed(1)}MB. Cloudinary maximum allowed video size is 100MB. Please compress or choose a file under 100MB.`
            )
          );
          return;
        }

        let result: any;
        if (isVideo) {
          result = await uploadLargeToCloudinary(tempFilePath, {
            resource_type: "video",
            folder: "anime-stories/video",
            chunk_size: 6000000, // 6MB chunks for large files
            eager: [
              {
                format: "mp4",
                video_codec: "h264",
                quality: "auto",
                width: 1080,
                height: 3840,
                crop: "limit",
              },
            ],
            eager_async: true,
          });
        } else if (isAudio) {
          result = await uploadLargeToCloudinary(tempFilePath, {
            resource_type: "auto",
            folder: "anime-stories/audio",
            chunk_size: 6000000,
          });
        } else {
          result = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: "image",
            folder: "anime-stories",
          });
        }

        const uploadedUrl = result?.secure_url || result?.url;
        if (!uploadedUrl) {
          throw new Error("Cloud storage did not return a valid media URL.");
        }

        cb(null, {
          path: uploadedUrl,
          filename: result.public_id,
          size: result.bytes,
        });
      } catch (uploadErr: any) {
        console.error("[Cloudinary Upload Error]", uploadErr);
        const errMsg =
          uploadErr?.message ||
          uploadErr?.error?.message ||
          "Failed to upload media to cloud storage";
        const customErr = new Error(errMsg);
        if (uploadErr?.http_code) {
          (customErr as any).statusCode = uploadErr.http_code;
        }
        cb(customErr);
      } finally {
        try {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch (unlinkErr) {
          console.warn("[Upload Cleanup Warning]", unlinkErr);
        }
      }
    });
  }

  _removeFile(
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null) => void
  ): void {
    if (file.filename) {
      cloudinary.uploader.destroy(file.filename, () => cb(null));
    } else {
      cb(null);
    }
  }
}

const storage = new RobustCloudinaryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max per file (Cloudinary free tier limit)
    fieldSize: 25 * 1024 * 1024, // 25MB max for metadata form fields
  },
});

export default upload;