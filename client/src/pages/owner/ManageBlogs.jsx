import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditBlog from '../../components/owner/EditBlog.jsx';

const ManageBlogs = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/v1/owners/blogs');
      if (data.success) setBlogs(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const toggleAvailability = async (id) => {
    try {
      const { data } = await axios.patch(`/api/v1/owners/toggle-blog/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/owners/delete-blog/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="px-4 pt-6 pb-6 md:px-10 md:pt-8 w-full">
      <Title
        title="Manage Blogs"
        subTitle="View all published blogs, update their availability, or remove them from the platform."
      />

      <div className="flex justify-end mt-4 mb-3">
        <button
          onClick={() => navigate('/owner/add-blog')}
          className="cursor-pointer px-4 py-2 bg-primary hover:bg-primary-dull text-white text-sm rounded-md transition-all"
        >
          + Add Blog
        </button>
      </div>

      <div className="w-full rounded-md overflow-hidden border border-borderColor">
        {/* Table scrollable on very small screens */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-[320px]">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Blog</th>
                <th className="p-3 font-medium hidden sm:table-cell">Category</th>
                <th className="p-3 font-medium hidden md:table-cell">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => {
                const thumbnail = blog.images?.[0]?.url || blog.image?.url || blog.image;
                return (
                  <tr
                    key={index}
                    className="border-t border-borderColor hover:bg-gray-50 transition"
                  >
                    {/* Blog Info */}
                    <td className="p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={thumbnail}
                          alt={blog.title}
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-xs sm:text-sm line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-400 hidden sm:block">{blog.readTime}</p>
                          {/* Category on mobile */}
                          <p className="text-xs text-gray-400 sm:hidden">{blog.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3 hidden sm:table-cell text-sm">{blog.category}</td>

                    {/* Status */}
                    <td className="p-3 hidden md:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${blog.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                      >
                        {blog.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          onClick={() => toggleAvailability(blog._id)}
                          src={blog.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                          className="cursor-pointer w-10 h-10 opacity-70 hover:opacity-100 transition"
                          alt="toggle"
                          title={blog.isAvailable ? 'Make Unavailable' : 'Make Available'}
                        />
                        <img
                          onClick={() => setEditingBlog(blog)}
                          src={assets.edit_button}
                          className="cursor-pointer h-4 opacity-70 hover:opacity-100 transition"
                          alt="edit"
                          title="Edit Blog"
                        />
                        <img
                          onClick={() => deleteBlog(blog._id)}
                          src={assets.delete_icon}
                          className="cursor-pointer w-10 h-10 opacity-70 hover:opacity-100 transition"
                          alt="delete"
                          title="Delete Blog"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400">
            <p className="text-3xl mb-2">📝</p>
            <p className="font-medium text-sm">No blogs yet</p>
            <p className="text-xs mt-1">Click "Add Blog" to publish your first post</p>
          </div>
        )} 
      </div>

      {editingBlog && (
        <EditBlog
          blog={editingBlog}
          axios={axios}
          onClose={() => setEditingBlog(null)}
          onSaved={() => {
            setEditingBlog(null);
            fetchBlogs();
          }}
        />
      )}
    </div>
  );
};

export default ManageBlogs;
