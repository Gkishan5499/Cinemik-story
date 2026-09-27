import express from "express";
import { handleContactSubmit } from "../controllers/contact.controller";

const router = express.Router();

// POST /api/contact
router.post("/", handleContactSubmit);

export default router;
