import React, { useState, useEffect } from 'react';
import Title from '../components/Title.jsx';
import { assets } from '../assets/assets.js';
import BlogCard from '../components/BlogCard.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { motion } from 'motion/react';

const Blogs = () => {
  const { blogs } = useAppContext();
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const categories = ['All', 'Luxury', 'Travel', 'Technology', 'Tips', 'Guide'];

  useEffect(() => {
    let filtered = [...blogs];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }
    if (input.trim() !== '') {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(input.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(input.toLowerCase()) ||
          blog.category?.toLowerCase().includes(input.toLowerCase()),
      );
    }
    setFilteredBlogs(filtered);
     console.log("Blogs:", blogs);
  }, [input, selectedCategory, blogs]);

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Our Blog"
          subTitle="Drive smarter, travel better with expert tips, guides, and stories from the road"
        />
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center bg-white px-4 mt-4 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by title or category..."
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6 xl:px-20 max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${
                  selectedCategory === category
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-gray-500 xl:px-20 max-w-7xl mx-auto"
        >
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Blog' : 'Blogs'}
        </motion.p>

        {/* Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div> 
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 text-gray-400 xl:px-20 max-w-7xl mx-auto"
          >
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg font-medium">No blogs found</p>
            <p className="text-sm mt-1">
              {input || selectedCategory !== 'All'
                ? 'Try adjusting your search or category filter'
                : 'Check back soon for new articles'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blogs;