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

export default app;