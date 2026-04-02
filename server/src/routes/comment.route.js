import express from "express";
import {
  addComment,
  getBlogComments,
  reactToComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = express.Router();

// Public
commentRouter.get("/:slug/comments", getBlogComments);

// Protected
commentRouter.post("/:slug/comments", verifyJWT, addComment);
commentRouter.patch("/comments/:commentId/react", verifyJWT, reactToComment);
commentRouter.delete("/comments/:commentId", verifyJWT, deleteComment);

export default commentRouter;
