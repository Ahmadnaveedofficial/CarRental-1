import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    tags: [{ type: String }],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
