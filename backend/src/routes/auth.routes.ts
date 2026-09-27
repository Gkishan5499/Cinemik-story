import express from "express";
import {
	becomeCreator,
	createUserByAdmin,
	deleteUserByAdmin,
	forgotPassword,
	getMe,
	getUsers,
	login,
	resetPassword,
	signup,
	updateMe,
	updateCreatorProfile,
	updateUserByAdmin,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.patch("/me/become-creator", authenticate, becomeCreator);
router.put("/me/creator-profile", authenticate, updateCreatorProfile);

router.get("/users", authenticate, requireAdmin, getUsers);
router.post("/users", authenticate, requireAdmin, createUserByAdmin);
router.put("/users/:id", authenticate, requireAdmin, updateUserByAdmin);
router.delete("/users/:id", authenticate, requireAdmin, deleteUserByAdmin);

export default router;
