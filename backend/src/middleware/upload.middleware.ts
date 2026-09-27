import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";

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
      try {
        const mime = (file.mimetype || "").toLowerCase();
        const isVideo =
          mime.startsWith("video/") ||
          [".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"].includes(ext);
        const isAudio =
          mime.startsWith("audio/") ||
          [".mp3", ".wav", ".ogg", ".m4a", ".aac"].includes(ext);

        let result: any;
        if (isVideo) {
          result = await cloudinary.uploader.upload_large(tempFilePath, {
            resource_type: "video",
            folder: "anime-stories/video",
            chunk_size: 6000000, // 6MB chunks for large files
          });
        } else if (isAudio) {
          result = await cloudinary.uploader.upload_large(tempFilePath, {
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

        cb(null, {
          path: result.secure_url || result.url,
          filename: result.public_id,
          size: result.bytes,
        });
      } catch (uploadErr: any) {
        console.error("[Cloudinary Upload Error]", uploadErr);
        const errMsg =
          uploadErr?.message ||
          uploadErr?.error?.message ||
          "Failed to upload media to cloud storage";
        cb(new Error(errMsg));
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
    fileSize: 100 * 1024 * 1024, // 100MB max limit
  },
});

export default upload;