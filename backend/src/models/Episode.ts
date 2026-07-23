import mongoose, { Document, Schema } from "mongoose";

export interface IEpisode extends Document {
  story: mongoose.Types.ObjectId;
  title: string;
  content: string;
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
