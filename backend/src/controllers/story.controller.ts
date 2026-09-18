import { Request, Response } from "express";
import Story from "../models/Story";
import Episode from "../models/Episode";
import Comment from "../models/Comment";
import Category from "../models/Category";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose from "mongoose";
import User from "../models/User";
import { DEFAULT_CATEGORIES, PREDEFINED_CATEGORY_NAMES } from "../config/categories";

const parseTags = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

// GET /api/stories — public listing (published stories only)
export const getStories = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter: any = { status: "published" };

    if (category) filter.category = { $regex: category, $options: "i" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Story.countDocuments(filter);
    const stories = await Story.find(filter)
      .populate("creator", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const storyIds = stories.map((s) => s._id);
    const commentAgg = await Comment.aggregate([
      { $match: { story: { $in: storyIds }, isApproved: true } },
      { $group: { _id: "$story", count: { $sum: 1 } } },
    ]);
    const commentMap = new Map(commentAgg.map((item) => [item._id.toString(), item.count]));

    const storiesWithCounts = stories.map((s) => ({
      ...s,
      likesCount: s.likes.length,
      commentsCount: commentMap.get(s._id.toString()) || 0,
    }));

    res.json({
      stories: storiesWithCounts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/my — creator's own stories
export const getMyStories = async (req: AuthRequest, res: Response) => {
  try {
    const stories = await Story.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const storyIds = stories.map((story) => story._id);
    const [commentsAgg, episodesAgg] = await Promise.all([
      Comment.aggregate([
        { $match: { story: { $in: storyIds }, isApproved: true } },
        { $group: { _id: "$story", count: { $sum: 1 } } },
      ]),
      Episode.aggregate([
        { $match: { story: { $in: storyIds } } },
        { $group: { _id: "$story", count: { $sum: 1 } } },
      ]),
    ]);

    const commentsMap = new Map(commentsAgg.map((item) => [item._id.toString(), item.count]));
    const episodesMap = new Map(episodesAgg.map((item) => [item._id.toString(), item.count]));

    const withCounts = stories.map((s) => ({
      ...s,
      likesCount: s.likes.length,
      commentsCount: commentsMap.get(s._id.toString()) || 0,
      episodesCount: episodesMap.get(s._id.toString()) || 0,
    }));

    res.json({ stories: withCounts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/:id — public
export const getStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate("creator", "username avatar bio")
      .populate({
        path: "episodes",
        options: { sort: { episodeNumber: 1 } },
      })
      .lean();

    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    // Increment views
    await Story.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const commentsCount = await Comment.countDocuments({
      story: story._id,
      isApproved: true,
    });

    res.json({
      story: {
        ...story,
        likesCount: story.likes.length,
        commentsCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories — creator
export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, tags, status, creatorId, backgroundMusic, contentType, videoUrl } = req.body;
    const files = (req as any).files as Record<string, any[]> | undefined;
    const coverImage =
      (req as any).file?.path ||
      files?.coverImage?.[0]?.path ||
      "";
    const backgroundMusicUrl =
      files?.backgroundMusic?.[0]?.path ||
      backgroundMusic ||
      "";
    const uploadedVideoUrl = files?.video?.[0]?.path || videoUrl || "";
    const characterImages = (files?.characterImages || []).map((file: any) => file.path);
    const scenicImages = (files?.scenicImages || []).map((file: any) => file.path);

    if (!title || !description) {
      res.status(400).json({ message: "Title and description are required" });
      return;
    }

    let creator = req.user._id;
    if (creatorId && req.user.role === "admin") {
      const creatorUser = await User.findById(creatorId).select("_id");
      if (!creatorUser) {
        res.status(404).json({ message: "Creator user not found" });
        return;
      }
      creator = creatorUser._id;
    }

    const story = await Story.create({
      title,
      description,
      contentType: contentType || (uploadedVideoUrl ? "video" : "text"),
      videoUrl: uploadedVideoUrl,
      coverImage,
      backgroundMusic: backgroundMusicUrl,
      characterImages,
      scenicImages,
      creator,
      category: category || "General",
      tags: parseTags(tags),
      status: status || "published",
    });

    res.status(201).json({ story });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/stories/:id — creator (own) or admin
export const updateStory = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to edit this story" });
      return;
    }

    const { title, description, category, tags, status, backgroundMusic, contentType, videoUrl } = req.body;
    const files = (req as any).files as Record<string, any[]> | undefined;
    const coverImage = (req as any).file?.path || files?.coverImage?.[0]?.path;
    const backgroundMusicUrl = files?.backgroundMusic?.[0]?.path || backgroundMusic;
    const uploadedVideoUrl = files?.video?.[0]?.path || videoUrl;
    const characterImages = (files?.characterImages || []).map((file: any) => file.path);
    const scenicImages = (files?.scenicImages || []).map((file: any) => file.path);

    if (title) story.title = title;
    if (description) story.description = description;
    if (contentType) story.contentType = contentType;
    if (uploadedVideoUrl !== undefined) story.videoUrl = uploadedVideoUrl;
    if (category) story.category = category;
    if (tags) story.tags = parseTags(tags);
    if (status) story.status = status;
    if (coverImage) story.coverImage = coverImage;
    if (backgroundMusicUrl !== undefined) story.backgroundMusic = backgroundMusicUrl;
    if (characterImages.length > 0) story.characterImages = characterImages;
    if (scenicImages.length > 0) story.scenicImages = scenicImages;

    await story.save();
    res.json({ story });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/stories/:id — creator (own) or admin
export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to delete this story" });
      return;
    }

    await Episode.deleteMany({ story: story._id });
    await Comment.deleteMany({ story: story._id });
    await Story.findByIdAndDelete(req.params.id);

    res.json({ message: "Story deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories/:id/like — toggle like
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const userId = req.user._id as mongoose.Types.ObjectId;
    const alreadyLiked = story.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      story.likes = story.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      story.likes.push(userId);
    }

    await story.save();
    res.json({ liked: !alreadyLiked, likesCount: story.likes.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/stories/:id/publish — toggle publish status
export const togglePublishStory = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to publish this story" });
      return;
    }

    story.status = story.status === "published" ? "draft" : "published";
    await story.save();

    res.json({ story, message: `Story ${story.status === "published" ? "published" : "unpublished"}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/admin/all
export const getAllStoriesForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const stories = await Story.find({})
      .populate("creator", "username email role")
      .sort({ createdAt: -1 })
      .lean();

    const storyIds = stories.map((story) => story._id);
    const commentsAgg = await Comment.aggregate([
      { $match: { story: { $in: storyIds } } },
      { $group: { _id: "$story", count: { $sum: 1 } } },
    ]);
    const commentsMap = new Map(commentsAgg.map((item) => [item._id.toString(), item.count]));

    const data = stories.map((story) => ({
      ...story,
      likesCount: story.likes.length,
      commentsCount: commentsMap.get(story._id.toString()) || 0,
    }));

    res.json({ stories: data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/:storyId/episodes
export const getEpisodesByStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.storyId).select("_id status");
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const episodes = await Episode.find({ story: story._id }).sort({ episodeNumber: 1 });
    res.json({ episodes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories/:storyId/episodes
export const createEpisode = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to add episodes to this story" });
      return;
    }

    const { title, content = "", episodeNumber, contentType, videoUrl, videoSections } = req.body;
    const reqFiles = (req as any).files;
    let images: string[] = [];
    let uploadedVideoUrl = videoUrl || "";

    const uploadedVideoFiles = (reqFiles && typeof reqFiles === "object" && !Array.isArray(reqFiles)) ? (reqFiles.video || []) : [];

    if (Array.isArray(reqFiles)) {
      images = reqFiles.map((file: any) => file.path);
    } else if (reqFiles && typeof reqFiles === "object") {
      images = (reqFiles.images || []).map((file: any) => file.path);
      if (uploadedVideoFiles.length > 0) {
        uploadedVideoUrl = uploadedVideoFiles[0].path;
      }
    }

    // Parse video sections
    let parsedSections: Array<{ title?: string; videoUrl: string; sectionNumber: number }> = [];
    if (videoSections) {
      try {
        const raw = typeof videoSections === "string" ? JSON.parse(videoSections) : videoSections;
        if (Array.isArray(raw)) {
          let fileIdx = 0;
          parsedSections = raw.map((sec: any, idx: number) => {
            let vUrl = sec.videoUrl || "";
            if ((!vUrl || vUrl.startsWith("file_placeholder")) && uploadedVideoFiles[fileIdx]) {
              vUrl = uploadedVideoFiles[fileIdx].path;
              fileIdx++;
            }
            return {
              title: sec.title || `Part ${idx + 1}`,
              videoUrl: vUrl,
              sectionNumber: idx + 1,
            };
          }).filter((sec) => sec.videoUrl);
        }
      } catch (e) {
        parsedSections = [];
      }
    }

    if (parsedSections.length === 0) {
      if (uploadedVideoFiles.length > 0) {
        parsedSections = uploadedVideoFiles.map((file: any, idx: number) => ({
          title: `Part ${idx + 1}`,
          videoUrl: file.path,
          sectionNumber: idx + 1,
        }));
      } else if (uploadedVideoUrl) {
        parsedSections = [{
          title: "Part 1",
          videoUrl: uploadedVideoUrl,
          sectionNumber: 1,
        }];
      }
    }

    if (!title || !episodeNumber) {
      res.status(400).json({ message: "Episode title and episode number are required" });
      return;
    }

    const existingEpisode = await Episode.findOne({
      story: story._id,
      episodeNumber: Number(episodeNumber),
    });

    if (existingEpisode) {
      res.status(409).json({ message: "Episode number already exists for this story" });
      return;
    }

    const finalContentType = contentType || (parsedSections.length > 0 || uploadedVideoUrl ? "video" : "text");

    const episode = await Episode.create({
      story: story._id,
      title,
      content,
      contentType: finalContentType,
      videoUrl: parsedSections[0]?.videoUrl || uploadedVideoUrl,
      videoSections: parsedSections,
      images,
      episodeNumber: Number(episodeNumber),
    });

    story.episodes.push(episode._id as mongoose.Types.ObjectId);
    await story.save();

    res.status(201).json({ episode });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/stories/:storyId/episodes/:episodeId
export const updateEpisode = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to edit episodes in this story" });
      return;
    }

    const episode = await Episode.findOne({ _id: req.params.episodeId, story: story._id });
    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    const { title, content, episodeNumber, contentType, videoUrl, videoSections } = req.body;
    const reqFiles = (req as any).files;
    let images: string[] = [];
    let uploadedVideoUrl: string | undefined = videoUrl;
    const uploadedVideoFiles = (reqFiles && typeof reqFiles === "object" && !Array.isArray(reqFiles)) ? (reqFiles.video || []) : [];

    if (Array.isArray(reqFiles)) {
      images = reqFiles.map((file: any) => file.path);
    } else if (reqFiles && typeof reqFiles === "object") {
      images = (reqFiles.images || []).map((file: any) => file.path);
      if (uploadedVideoFiles.length > 0) {
        uploadedVideoUrl = uploadedVideoFiles[0].path;
      }
    }

    // Parse video sections if passed
    if (videoSections !== undefined) {
      let parsedSections: Array<{ title?: string; videoUrl: string; sectionNumber: number }> = [];
      try {
        const raw = typeof videoSections === "string" ? JSON.parse(videoSections) : videoSections;
        if (Array.isArray(raw)) {
          let fileIdx = 0;
          parsedSections = raw.map((sec: any, idx: number) => {
            let vUrl = sec.videoUrl || "";
            if ((!vUrl || vUrl.startsWith("file_placeholder")) && uploadedVideoFiles[fileIdx]) {
              vUrl = uploadedVideoFiles[fileIdx].path;
              fileIdx++;
            }
            return {
              title: sec.title || `Part ${idx + 1}`,
              videoUrl: vUrl,
              sectionNumber: idx + 1,
            };
          }).filter((sec) => sec.videoUrl);
        }
      } catch (e) {
        parsedSections = [];
      }
      episode.videoSections = parsedSections;
      if (parsedSections.length > 0) {
        episode.videoUrl = parsedSections[0].videoUrl;
      }
    } else if (uploadedVideoUrl !== undefined) {
      episode.videoUrl = uploadedVideoUrl;
    }

    if (title) episode.title = title;
    if (content !== undefined) episode.content = content;
    if (contentType) episode.contentType = contentType;

    if (episodeNumber) {
      const duplicateEpisodeNumber = await Episode.findOne({
        story: story._id,
        episodeNumber: Number(episodeNumber),
        _id: { $ne: episode._id },
      });
      if (duplicateEpisodeNumber) {
        res.status(409).json({ message: "Episode number already exists for this story" });
        return;
      }
      episode.episodeNumber = Number(episodeNumber);
    }

    if (images.length > 0) episode.images = images;

    await episode.save();
    res.json({ episode });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/stories/:storyId/episodes/:episodeId
export const deleteEpisode = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const isOwner = story.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to delete episodes in this story" });
      return;
    }

    const episode = await Episode.findOneAndDelete({
      _id: req.params.episodeId,
      story: story._id,
    });

    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    story.episodes = story.episodes.filter(
      (id) => id.toString() !== req.params.episodeId
    );
    await story.save();

    await Comment.deleteMany({ episode: episode._id });

    res.json({ message: "Episode deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/:storyId/comments
export const getCommentsByStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.storyId).select("_id");
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    const comments = await Comment.find({ story: story._id, isApproved: true })
      .populate("user", "username avatar")
      .populate("episode", "title episodeNumber")
      .sort({ createdAt: -1 });

    res.json({ comments, total: comments.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories/:storyId/comments
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text, episodeId } = req.body;
    if (!text) {
      res.status(400).json({ message: "Comment text is required" });
      return;
    }

    const story = await Story.findById(req.params.storyId).select("_id");
    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    let episode: mongoose.Types.ObjectId | undefined;
    if (episodeId) {
      const episodeRecord = await Episode.findOne({ _id: episodeId, story: story._id }).select("_id");
      if (!episodeRecord) {
        res.status(404).json({ message: "Episode not found for this story" });
        return;
      }
      episode = episodeRecord._id as mongoose.Types.ObjectId;
    }

    const comment = await Comment.create({
      user: req.user._id,
      story: story._id,
      episode,
      text,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username avatar")
      .populate("episode", "title episodeNumber");

    res.status(201).json({ comment: populatedComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/stories/comments/:commentId
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ message: "Comment text is required" });
      return;
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to edit this comment" });
      return;
    }

    comment.text = text;
    await comment.save();

    res.json({ comment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/stories/comments/:commentId
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Not authorized to delete this comment" });
      return;
    }

    await Comment.findByIdAndDelete(comment._id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/admin/comments
export const getAllCommentsForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await Comment.find({})
      .populate("user", "username email role")
      .populate("story", "title")
      .populate("episode", "title episodeNumber")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/stories/admin/comments/:commentId/approve
export const approveCommentByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { isApproved } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    comment.isApproved = isApproved !== undefined ? Boolean(isApproved) : true;
    await comment.save();

    res.json({ message: "Comment approval updated", comment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categories — get all categories (default + custom)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories — create custom category (creator/admin)
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      res.status(409).json({ message: "Category already exists" });
      return;
    }

    // Check if trying to create a default category
    if (PREDEFINED_CATEGORY_NAMES.includes(name)) {
      res.status(400).json({ message: `${name} is a predefined category` });
      return;
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
      isDefault: false,
    });

    res.status(201).json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:categoryId — delete custom category (admin)
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (category.isDefault) {
      res
        .status(403)
        .json({ message: "Cannot delete predefined categories" });
      return;
    }

    await Category.findByIdAndDelete(req.params.categoryId);
    res.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Init default categories (call once on server startup)
export const initializeDefaultCategories = async () => {
  try {
    for (const defaultCategory of DEFAULT_CATEGORIES) {
      const exists = await Category.findOne({
        name: defaultCategory.name,
      });
      if (!exists) {
        await Category.create(defaultCategory);
      }
    }
  } catch (error) {
    console.error("Error initializing default categories:", error);
  }
};
