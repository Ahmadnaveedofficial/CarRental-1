import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

// Add Comment or Reply
const addComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { slug } = req.params;
  const { text, parentCommentId } = req.body;

  if (!text?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Comment text is required"));
  }

  const blog = await Blog.findOne({ slug, isAvailable: true });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }

  // Agar reply hai toh parent validate karo
  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId);
    if (!parent || parent.blog.toString() !== blog._id.toString()) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Parent comment not found"));
    }
    // Sirf top-level comments par reply allow karo 1 level deep
    if (parent.parentComment !== null) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Replies to replies are not allowed"));
    }
  }

  const comment = await Comment.create({
    blog: blog._id,
    author: _id,
    text,
    parentComment: parentCommentId || null,
  });

  const populated = await comment.populate("author", "name image");

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", populated));
});

// Get All Comments for a Blog
const getBlogComments = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug, isAvailable: true });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }

  // Sirf top level comments fetch karo
  const topLevelComments = await Comment.find({
    blog: blog._id,
    parentComment: null,
  })
    .populate("author", "name image")
    .sort({ createdAt: -1 });

  // Har top level comment ki replies fetch karo
  const commentsWithReplies = await Promise.all(
    topLevelComments.map(async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate("author", "name image")
        .sort({ createdAt: 1 });
      return { ...comment.toObject(), replies };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Comments fetched successfully", commentsWithReplies)
    );
});

// Like / Dislike Toggle
const reactToComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { commentId } = req.params;
  const { type } = req.body; // "like" or "dislike"

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json(new ApiResponse(400, "Invalid reaction type"));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, "Comment not found"));
  }

  const userId = _id.toString();
  const likeIndex = comment.likes.findIndex((id) => id.toString() === userId);
  const dislikeIndex = comment.dislikes.findIndex(
    (id) => id.toString() === userId
  );

  if (type === "like") {
    if (likeIndex > -1) {
      // Already liked → unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(_id);
      // Dislike tha toh hata do
      if (dislikeIndex > -1) comment.dislikes.splice(dislikeIndex, 1);
    }
  } else {
    if (dislikeIndex > -1) {
      // Already disliked → un-dislike
      comment.dislikes.splice(dislikeIndex, 1);
    } else {
      comment.dislikes.push(_id);
      // Like tha toh hata do
      if (likeIndex > -1) comment.likes.splice(likeIndex, 1);
    }
  }

  await comment.save();

  return res.status(200).json(
    new ApiResponse(200, "Reaction updated", {
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userLiked: comment.likes.map((id) => id.toString()).includes(userId),
      userDisliked: comment.dislikes
        .map((id) => id.toString())
        .includes(userId),
    })
  );
});

//  Delete Comment
const deleteComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate("blog");
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, "Comment not found"));
  }

  const isAuthor = comment.author.toString() === _id.toString();
  const isBlogOwner = comment.blog.owner.toString() === _id.toString();

  if (!isAuthor && !isBlogOwner) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Not authorized to delete this comment"));
  }

  // Soft delete  text replace replies intact rehti hain
  comment.isDeleted = true;
  // comment.text = "This comment was deleted.";
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

export { addComment, getBlogComments, reactToComment, deleteComment };
