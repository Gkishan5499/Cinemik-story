import express from "express";
import upload from "../middleware/upload.middleware";

const router = express.Router();

// Single image upload (cover, profile, etc.)
router.post("/single", upload.single("image"), (req: any, res: any) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No image file provided" });
  }
  res.json({
    url: req.file.path,
  });
});

// Single video upload
router.post("/video", upload.single("video"), (req: any, res: any) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No video file provided" });
  }
  res.json({
    url: req.file.path,
  });
});

// Multiple videos upload (episodes)
router.post("/videos", upload.array("videos", 30), (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No video files provided" });
  }
  const urls = req.files.map((file: any) => file.path);
  res.json({ urls });
});

// Single media upload (image, video, or audio)
router.post("/single-media", upload.single("media"), (req: any, res: any) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No media file provided" });
  }
  res.json({
    url: req.file.path,
  });
});

// Single audio upload
router.post("/audio", upload.single("audio"), (req: any, res: any) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No audio file provided" });
  }
  res.json({
    url: req.file.path,
  });
});

// Multiple images upload (episodes / comic panels)
router.post("/multiple", upload.array("images", 50), (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No image files provided" });
  }
  const urls = req.files.map((file: any) => file.path);
  res.json({ urls });
});

export default router;