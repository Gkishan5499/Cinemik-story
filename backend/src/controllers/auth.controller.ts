import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import Story from "../models/Story";
import Episode from "../models/Episode";
import Comment from "../models/Comment";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

// POST /api/auth/signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "reader",
    });
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account is deactivated" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ user: req.user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// PUT /api/auth/me
export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio } = req.body;
    const avatarUrl = (req as any).file?.path;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl) updateData.avatar = avatarUrl;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// PATCH /api/auth/me/become-creator
export const becomeCreator = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "creator" || user.role === "admin") {
      res.json({
        message: user.role === "creator" ? "You are already a creator" : "Admin already has creator privileges",
        user,
      });
      return;
    }

    user.role = "creator";
    await user.save();

    res.json({
      message: "Upgraded to creator successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// PUT /api/auth/me/creator-profile
export const updateCreatorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { address, city, country, bio, interests } = req.body;

    // Update profile fields
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (country !== undefined) user.country = country;
    if (bio !== undefined) user.bio = bio;
    if (interests !== undefined) user.interests = interests;

    // Upgrade to creator if still reader
    if (user.role === "reader") {
      user.role = "creator";
    }

    await user.save();

    res.json({
      message: "Creator profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        address: user.address,
        city: user.city,
        country: user.country,
        interests: user.interests,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET /api/auth/users
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// POST /api/auth/users
export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, role, bio, avatar, isActive } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Username, email and password are required" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role === "admin" ? "admin" : role === "creator" ? "creator" : "reader",
      bio: bio || "",
      avatar: avatar || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// PUT /api/auth/users/:id
export const updateUserByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, role, bio, avatar, isActive, password } = req.body;

    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role && ["reader", "creator", "admin"].includes(role)) user.role = role;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (isActive !== undefined) user.isActive = Boolean(isActive);
    if (password) user.password = password;

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    res.json({ message: "User updated successfully", user: safeUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// DELETE /api/auth/users/:id
export const deleteUserByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (req.user._id.toString() === req.params.id && user.role === "admin") {
      res.status(400).json({ message: "Admin cannot delete own account" });
      return;
    }

    const userStories = await Story.find({ creator: user._id }).select("_id").lean();
    const storyIds = userStories.map((story) => story._id);

    await Episode.deleteMany({
      $or: [{ story: { $in: storyIds } }],
    });
    await Comment.deleteMany({
      $or: [{ user: user._id }, { story: { $in: storyIds } }],
    });
    await Story.deleteMany({ creator: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and related content deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
