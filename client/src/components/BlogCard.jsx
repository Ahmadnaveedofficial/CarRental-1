import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const thumbnail = blog.images?.[0]?.url || blog.image?.url || blog.image;

  return (
    <div
      onClick={() => navigate(`/blogs/${blog.slug}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="overflow-hidden h-52">
        <img
          src={thumbnail}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category and Read Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} /> {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{blog.excerpt}</p>

        {/* Date and Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={10} />
            {blog.date ||
              new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </p>
          <span className="text-primary group-hover:translate-x-1 transition-transform duration-200">
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
