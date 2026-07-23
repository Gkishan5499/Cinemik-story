import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: (_req, file) => {
        const isAudio = file.mimetype?.startsWith("audio/");

        return {
            folder: isAudio ? "anime-stories/audio" : "anime-stories",
            resource_type: "auto",
            allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp3", "wav", "ogg", "m4a", "aac"],
        } as any;
    },
});

const upload = multer({ storage });

export default upload;