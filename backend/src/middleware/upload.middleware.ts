import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: (_req, file) => {
        const isAudio = file.mimetype?.startsWith("audio/");
        const isVideo = file.mimetype?.startsWith("video/");

        let folder = "anime-stories";
        if (isAudio) folder = "anime-stories/audio";
        if (isVideo) folder = "anime-stories/video";

        return {
            folder,
            resource_type: "auto",
            allowed_formats: [
                "jpg", "png", "jpeg", "webp", "gif", 
                "mp3", "wav", "ogg", "m4a", "aac",
                "mp4", "webm", "mov", "mkv", "avi", "m4v"
            ],
        } as any;
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size limit
    },
});

export default upload;