import express from "express";
import upload from "../middleware/upload.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireCreator } from "../middleware/role.middleware";
import {
	approveCommentByAdmin,
	createCategory,
	createComment,
	createEpisode,
	createStory,
	deleteCategory,
	deleteComment,
	deleteEpisode,
	deleteStory,
	getAllCommentsForAdmin,
	getAllStoriesForAdmin,
	getCategories,
	getCommentsByStory,
	getEpisodesByStory,
	getMyStories,
	getStories,
	getStory,
	toggleLike,
	togglePublishStory,
	updateComment,
	updateEpisode,
	updateStory,
} from "../controllers/story.controller";

const router = express.Router();

// Categories
router.get("/categories/list", getCategories);
router.post("/categories", authenticate, createCategory);
router.delete("/categories/:categoryId", authenticate, requireAdmin, deleteCategory);

// Admin
router.get("/admin/all", authenticate, requireAdmin, getAllStoriesForAdmin);
router.get("/admin/comments", authenticate, requireAdmin, getAllCommentsForAdmin);
router.patch(
	"/admin/comments/:commentId/approve",
	authenticate,
	requireAdmin,
	approveCommentByAdmin
);

// Public stories
router.get("/", getStories);

// Creator stories
router.get("/my/list", authenticate, requireCreator, getMyStories);
router.post(
	"/",
	authenticate,
	requireCreator,
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "backgroundMusic", maxCount: 1 },
		{ name: "characterImages", maxCount: 12 },
		{ name: "scenicImages", maxCount: 12 },
	]),
	createStory
);
router.put(
	"/:id",
	authenticate,
	requireCreator,
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "backgroundMusic", maxCount: 1 },
		{ name: "characterImages", maxCount: 12 },
		{ name: "scenicImages", maxCount: 12 },
	]),
	updateStory
);
router.delete("/:id", authenticate, requireCreator, deleteStory);

router.get("/:id", getStory);

// Likes
router.post("/:id/like", authenticate, toggleLike);

// Publish
router.patch("/:id/publish", authenticate, togglePublishStory);

// Episodes
router.get("/:storyId/episodes", getEpisodesByStory);
router.post(
	"/:storyId/episodes",
	authenticate,
	requireCreator,
	upload.array("images", 10),
	createEpisode
);
router.put(
	"/:storyId/episodes/:episodeId",
	authenticate,
	requireCreator,
	upload.array("images", 10),
	updateEpisode
);
router.delete(
	"/:storyId/episodes/:episodeId",
	authenticate,
	requireCreator,
	deleteEpisode
);

// Comments
router.get("/:storyId/comments", getCommentsByStory);
router.post("/:storyId/comments", authenticate, createComment);
router.put("/comments/:commentId", authenticate, updateComment);
router.delete("/comments/:commentId", authenticate, deleteComment);

export default router;
