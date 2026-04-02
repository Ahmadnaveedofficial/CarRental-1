import React, { useState, useRef } from 'react';
import Title from '../../components/owner/Title.jsx';
import { assets } from '../../assets/assets.js';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X, ImagePlus } from 'lucide-react';

const AddBlog = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [blog, setBlog] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    readTime: '',
  });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (images.length === 0) return toast.error('Please upload at least one image');
    if (!user) return toast.error('You must be logged in to create a blog');

    setIsLoading(true);
    try {
      const formData = new FormData();
      images.forEach(({ file }) => formData.append('images', file));
      formData.append('title', blog.title);
      formData.append('category', blog.category);
      formData.append('excerpt', blog.excerpt);
      formData.append('content', blog.content);
      formData.append('readTime', blog.readTime);
      formData.append('tags', JSON.stringify(tags));
      formData.append('authorId', user._id);

      const { data } = await axios.post('/api/v1/owners/add-blog', formData);
      if (data.success) {
        toast.success(data.message);
        images.forEach(({ preview }) => URL.revokeObjectURL(preview));
        setImages([]);
        setTags([]);
        setTagInput('');
        setBlog({ title: '', category: '', excerpt: '', content: '', readTime: '' });
        navigate('/owner/manage-blogs');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 flex-1">
      <Title
        title="Add New Blog"
        subTitle="Fill in the details to publish a new blog post on the platform."
      />

      <form
        onSubmit={onSubmitHandle}
        className="flex flex-col gap-4 sm:gap-5 text-gray-500 text-sm mt-5 w-full max-w-xl"
      >
        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-600">Cover Images</label>

          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden h-20 sm:h-24 border border-borderColor"
                >
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="h-20 sm:h-24 border-2 border-dashed border-borderColor rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
              >
                <ImagePlus size={20} />
                <span className="text-xs">Add more</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-borderColor rounded-xl py-8 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
            >
              <ImagePlus size={28} />
              <span className="text-sm">Click to upload images</span>
              <span className="text-xs text-gray-300">PNG, JPG, WEBP — max 10 images</span>
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Title *</label>
          <input
            type="text"
            placeholder="e.g. Top 10 Luxury Cars You Can Rent in 2025"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />
        </div>

        {/* Category & Read Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Category *</label>
            <select
              required
              value={blog.category}
              onChange={(e) => setBlog({ ...blog, category: e.target.value })}
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            >
              <option value="">Select a category</option>
              <option value="Luxury">Luxury</option>
              <option value="Travel">Travel</option>
              <option value="Technology">Technology</option>
              <option value="Tips">Tips</option>
              <option value="Guide">Guide</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Read Time</label>
            <input
              type="text"
              placeholder="e.g. 5 min read"
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={blog.readTime}
              onChange={(e) => setBlog({ ...blog, readTime: e.target.value })}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Excerpt *</label>
          <textarea
            rows={3}
            placeholder="Short description of the blog..."
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none resize-none focus:border-primary text-sm"
            value={blog.excerpt}
            onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">
            Content * <span className="text-gray-400 font-normal">(HTML supported)</span>
          </label>
          <textarea
            rows={8}
            placeholder="<h2>Heading</h2><p>Your blog content here...</p>"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none font-mono resize-none focus:border-primary text-sm"
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g. Luxury, Sports, Premium..."
              className="px-3 py-2 border border-borderColor rounded-md outline-none flex-1 focus:border-primary text-sm"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull cursor-pointer text-sm"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md font-medium w-max cursor-pointer hover:bg-primary-dull transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <img src={assets.tick_icon} alt="" className="w-4 h-4" />
          {isLoading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;