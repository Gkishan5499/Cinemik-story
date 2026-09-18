import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.routes";
import authRoutes from "./routes/auth.routes";
import storyRoutes from "./routes/story.routes";
import { setupSwagger } from "./docs/swagger";
import { initializeDefaultCategories } from "./controllers/story.controller";
import { ensureDefaultAdmin } from "./config/bootstrapAdmin";

import multer from "multer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
        console.error("[Multer Error]", err.message);
        if (!res.headersSent) {
            res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        return;
    }
    console.error("[Unhandled Error]", err);
    if (!res.headersSent) {
        res.status(500).json({ error: err?.message || "Internal server error" });
    }
});

export default app;