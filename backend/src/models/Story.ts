import mongoose, { Document, Schema } from "mongoose";

export interface IStory extends Document {
  title: string;
  description: string;
  coverImage: string;
  backgroundMusic: string;
  characterImages: string[];
  scenicImages: string[];
  creator: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  views: number;
  likes: mongoose.Types.ObjectId[];
  status: "draft" | "published";
  episodes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
    },
    coverImage: {
      type: String,
      default: "",
    },
    backgroundMusic: {
      type: String,
      default: "",
    },
    characterImages: [{ type: String, default: [] }],
    scenicImages: [{ type: String, default: [] }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    views: {
      type: Number,
      default: 0,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
  },
  { timestamps: true }
);

export default mongoose.model<IStory>("Story", StorySchema);
