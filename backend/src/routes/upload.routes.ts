import express from "express";
import upload from "../middleware/upload.middleware";

const router = express.Router();

// Single image upload (cover)
router.post("/single", upload.single("image"), (req: any, res) => {
    res.json({
        url: req.file.path,
    });
});

// Single media upload (image or audio)
router.post("/single-media", upload.single("media"), (req: any, res) => {
    res.json({
        url: req.file.path,
    });
});

// Single audio upload
router.post("/audio", upload.single("audio"), (req: any, res) => {
    res.json({
        url: req.file.path,
    });
});

// Multiple images upload (episodes)
router.post("/multiple", upload.array("images", 10), (req: any, res) => {
    const urls = req.files.map((file: any) => file.path);
    res.json({ urls });
});

export default router;