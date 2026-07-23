import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  episode?: mongoose.Types.ObjectId;
  text: string;
  isApproved: boolean;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    episode: {
      type: Schema.Types.ObjectId,
      ref: "Episode",
      default: null,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
