import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import CommentSection from '../components/Commentsection.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { Tag } from 'lucide-react';
import { assets } from '../assets/assets.js';
import { motion } from 'motion/react';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { axios, blogs } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/v1/blogs/${slug}`);
        if (data.success) setBlog(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    setActiveImage(0);
  }, [blog]);

  const relatedBlogs = blogs
    .filter((b) => b.category === blog?.category && b._id !== blog?._id)
    .slice(0, 3);

  const gallery = blog
    ? blog.images?.length > 0
      ? blog.images
      : blog.image?.url
        ? [{ url: blog.image.url }]
        : []
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex flex-col items-center justify-center text-gray-400"
      >
        <p className="text-6xl mb-4">😕</p>
        <p className="text-xl font-semibold">Blog not found</p>
        <button
          onClick={() => navigate('/blogs')}
          className="mt-4 text-primary underline text-sm cursor-pointer hover:text-primary/80 transition-colors"
        >
          Go back to Blogs
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16"
    >
      {/* Back Button */}
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer group"
        >
          <img
            src={assets.arrow_icon}
            alt=""
            className="rotate-180 opacity-65 group-hover:-translate-x-1 transition-transform"
          />
          Back to all blogs
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Image Gallery */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden shadow-md mb-3 h-72 md:h-96">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={gallery[activeImage]?.url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {gallery.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                      ${
                        activeImage === index
                          ? 'border-primary opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                  >
                    <img src={img.url} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Category & Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
              {blog.category}
            </span>
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
          >
            {blog.title}
          </motion.h1>

          <hr className="border-borderColor" />

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-xl font-medium mb-3">Written By</h1>
            <div className="flex items-center gap-4 p-4 border border-borderColor rounded-xl bg-light">
              {blog.owner?.image?.url ? (
                <img
                  src={blog.owner.image.url}
                  alt={blog.owner.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {blog.owner?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{blog.owner?.name}</p>
                <p className="text-xs text-gray-400">{blog.owner?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h1 className="text-xl font-medium mb-3">Content</h1>
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed
                prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-800 prose-h2:mt-8 prose-h2:mb-3
                prose-p:mb-4 prose-p:text-gray-600 prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-borderColor"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📚 Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((b, index) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
                >
                  <BlogCard blog={b} />
                </motion.div>
              ))}
            </div>
          </motion.div> 
        )}
 
        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-borderColor"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💬 Comments</h2>
          <CommentSection slug={slug} blogOwnerId={blog.owner?._id} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogDetails;