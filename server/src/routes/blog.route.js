import { Router } from "express";
import { getAllBlogs, getBlogBySlug } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.route("/").get(getAllBlogs);
blogRouter.route("/:slug").get(getBlogBySlug);
export default blogRouter;
