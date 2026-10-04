import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.routes";
import authRoutes from "./routes/auth.routes";
import storyRoutes from "./routes/story.routes";
import contactRoutes from "./routes/contact.routes";
import { setupSwagger } from "./docs/swagger";
import { initializeDefaultCategories } from "./controllers/story.controller";
import { ensureDefaultAdmin } from "./config/bootstrapAdmin";

import multer from "multer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));

connectDB()
    .then(async () => {
        await initializeDefaultCategories();
        await ensureDefaultAdmin();
    })
    .catch((error) => {
        console.error("Startup initialization failed", error);
    });

app.get("/", (req, res) => {
    res.send("API running...");
});

setupSwagger(app);

app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/contact", contactRoutes);

// Global Error Handler Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err?.message === "Request aborted" || err?.code === "ECONNRESET") {
        console.warn("[Upload Warning] Request aborted by client or connection reset.");
        if (!res.headersSent) {
            res.status(400).json({ error: "Upload cancelled or connection interrupted." });
        }
        return;
    }
    if (err instanceof multer.MulterError) {
        console.error("[Multer Error]", err.message, err.code);
        if (!res.headersSent) {
            if (err.code === "LIMIT_FILE_SIZE") {
                res.status(413).json({
                    error: "Upload failed: File is too large. Maximum allowed size is 100MB per file.",
                    code: "LIMIT_FILE_SIZE",
                });
            } else {
                res.status(400).json({ error: `Upload error: ${err.message}`, code: err.code });
            }
        }
        return;
    }
    console.error("[Unhandled Error]", err);
    if (!res.headersSent) {
        const isTooLarge =
            err?.status === 413 ||
            err?.statusCode === 413 ||
            (err?.message && (err.message.includes("too large") || err.message.includes("exceeds the allowed limit")));
        const status = isTooLarge ? 413 : (err?.status || err?.statusCode || 500);
        res.status(status).json({
            error: isTooLarge
                ? (err?.message || "File too large. Maximum allowed size is 100MB per file.")
                : (err?.message || "Internal server error"),
        });
    }
});

export default app;