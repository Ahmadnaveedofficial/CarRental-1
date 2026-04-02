import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";

// Get all available blogs  Public
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isAvailable: true }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, "Blogs fetched successfully", blogs));
});

// Get single blog by slug   Public
const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug, isAvailable: true }).populate(
    "owner",
    "name email image"
  );
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Blog fetched successfully", blog));
});

// Create blog Owner only
const addBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { title, category, excerpt, content, readTime, tags } = req.body;

  if (!title || !category || !excerpt || !content) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All required fields must be filled"));
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Blog with this title already exists"));
  }

  const files = req.files;
  if (!files || files.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "At least one image is required"));
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return { public_id: result.public_id || "", url: result.secure_url || "" };
    })
  );

  const blog = await Blog.create({
    title, slug, category, excerpt, content,
    images: uploadedImages,
    tags: tags ? JSON.parse(tags) : [],
    readTime: readTime || "5 min read",
    owner: _id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Blog created successfully", blog));
});

// Update blog  Owner only
const updateBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { title, category, excerpt, content, readTime, tags, existingImages } = req.body;

  const blog = await Blog.findOne({ _id: id, owner: _id });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }

  // if owner remove image then remove on cloudinary
  const keptImages = existingImages ? JSON.parse(existingImages) : [];
  const keptPublicIds = keptImages.map((img) => img.public_id).filter(Boolean);
  const removedImages = blog.images.filter(
    (img) => img.public_id && !keptPublicIds.includes(img.public_id)
  );
  await Promise.all(removedImages.map((img) => deleteOnCloudinary(img.public_id)));


  const newFiles = req.files || [];
  const newUploaded = await Promise.all(
    newFiles.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return { public_id: result.public_id || "", url: result.secure_url || "" };
    })
  );

  const finalImages = [...keptImages, ...newUploaded];
  if (finalImages.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "At least one image is required"));
  }

  blog.title = title || blog.title;
  blog.category = category || blog.category;
  blog.excerpt = excerpt || blog.excerpt;
  blog.content = content || blog.content;
  blog.readTime = readTime || blog.readTime;
  blog.tags = tags ? JSON.parse(tags) : blog.tags;
  blog.images = finalImages;
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully", blog));
});

// Toggle blog availability  Owner only
const toggleBlogAvailability = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const blog = await Blog.findOne({ _id: id, owner: _id });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }
  blog.isAvailable = !blog.isAvailable;
  await blog.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Blog availability toggled successfully", blog));
});

// Delete blog  Owner only
const deleteBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const blog = await Blog.findOne({ _id: id, owner: _id });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, "Blog not found"));
  }
  if (blog.images?.length > 0) {
    await Promise.all(
      blog.images.map(async (img) => {
        if (img.public_id) await deleteOnCloudinary(img.public_id);
      })
    );
  }
  await Blog.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully", blog));
});

//Owner blog 
const ownerBlogs = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const blogs = await Blog.find({ owner: _id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, "Owner blogs fetched successfully", blogs));
});

export {
  getAllBlogs,
  getBlogBySlug,
  addBlog,
  updateBlog,
  toggleBlogAvailability,
  deleteBlog,
  ownerBlogs,
};      