import mongoose, { Document, Schema } from "mongoose";

export interface IEpisodeVideoSection {
  title?: string;
  videoUrl: string;
  sectionNumber?: number;
}

export interface IEpisode extends Document {
  story: mongoose.Types.ObjectId;
  title: string;
  content: string;
  contentType: "text" | "video";
  videoUrl: string;
  videoSections?: IEpisodeVideoSection[];
  images: string[];
  episodeNumber: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const EpisodeSchema = new Schema<IEpisode>(
  {
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Episode title is required"],
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      default: "",
    },
    contentType: {
      type: String,
      enum: ["text", "video"],
      default: "text",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    videoSections: [
      {
        title: { type: String, default: "" },
        videoUrl: { type: String, default: "" },
        sectionNumber: { type: Number, default: 1 },
      },
    ],
    images: [{ type: String }],
    episodeNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEpisode>("Episode", EpisodeSchema);
