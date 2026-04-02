import React, { useEffect, useRef, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { assets } from '../../assets/assets.js';
import toast from 'react-hot-toast';

const EditBlog = ({ blog, onClose, onSaved, axios }) => {
  const fileInputRef = useRef(null);

  const [existingImages, setExistingImages] = useState(() => {
    if (blog.images?.length > 0) return blog.images;
    if (blog.image?.url) return [{ public_id: blog.image.public_id, url: blog.image.url }];
    return [];
  });
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(blog.tags || []);
  const [form, setForm] = useState({
    title: blog.title || '',
    category: blog.category || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    readTime: blog.readTime || '',
  });

  const totalImages = existingImages.length + newImages.length;

  useEffect(() => {
    // Lock body scroll when modal open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      newImages.forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [newImages]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const removeExisting = (index) => setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const removeNew = (index) => {
    setNewImages((prev) => {
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

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalImages === 0) return toast.error('At least one image is required');

    setIsLoading(true);
    try {
      const formData = new FormData();
      newImages.forEach(({ file }) => formData.append('images', file));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('readTime', form.readTime);
      formData.append('tags', JSON.stringify(tags));

      const { data } = await axios.patch(`/api/v1/owners/edit-blog/${blog._id}`, formData);
      if (data.success) {
        toast.success(data.message);
        onSaved();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white w-full sm:rounded-2xl sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle  mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Edit Blog</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 text-sm text-gray-500"
        >
          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">
              Images <span className="text-xs text-gray-400">(First image will be cover)</span>
            </label>

            {totalImages > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {existingImages.map((img, i) => (
                  <div
                    key={`ex-${i}`}
                    className="relative group rounded-lg overflow-hidden h-20 border border-gray-200"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExisting(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {newImages.map((img, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative group rounded-lg overflow-hidden h-20 border border-gray-200"
                  >
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNew(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                    {existingImages.length === 0 && i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
                >
                  <ImagePlus size={18} />
                  <span className="text-[11px]">Add</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
              >
                <ImagePlus size={24} />
                <span className="text-xs">Click to upload images</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            />
          </div>

          {/* Category and ReadTime */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              >
                <option value="">Select Category</option>
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
                placeholder="e.g., 5 min read"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Excerpt *</label>
            <textarea
              rows={2}
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              placeholder="Brief summary of your blog..."
            />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">
              Content * <span className="text-gray-400 font-normal">(HTML supported)</span>
            </label>
            <textarea
              rows={6}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md outline-none font-mono resize-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              placeholder="Write your blog content here..."
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
                onKeyDown={handleKeyDown}
                placeholder="Add a tag and press Enter..."
                className="px-3 py-2 border border-gray-200 rounded-md outline-none flex-1 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition cursor-pointer text-sm"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 font-bold ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-1 pb-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dull transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <img src={assets.tick_icon} alt="save" className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 border border-gray-200 text-gray-500 rounded-md hover:bg-gray-50 transition cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;