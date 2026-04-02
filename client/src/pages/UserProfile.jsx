import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Camera,
  Edit3,
  Save,
  X,
  Lock,
} from 'lucide-react';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const UserProfile = () => {
  const { user, axios, fetchUser } = useAppContext();
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    cnic: '',
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dob: user?.dob?.split('T')[0] || '',
      gender: user?.gender || '',
      cnic: user?.cnic || '',
    });
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/users/update-profile', formData);
      if (data?.success) {
        toast.success('Profile updated successfully');
        fetchUser();
        setIsEditing(false);
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImageLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await axios.post('/api/v1/users/update-profile-image', fd);
      if (data?.success) {
        toast.success(data.message);
        fetchUser();
        setImage(null);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return toast.error('All fields are required');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setPasswordLoading(true);
    try {
      const { data } = await axios.post('/api/v1/users/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      if (data?.success) {
        toast.success('Password changed successfully');
        setShowPasswordModal(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const infoCards = [
    {
      icon: <Mail size={15} className="text-blue-500" />,
      label: 'Email',
      value: user?.email,
      bg: 'bg-blue-50',
    },
    {
      icon: <Phone size={15} className="text-green-500" />,
      label: 'Phone',
      value: user?.phone || 'Not set',
      bg: 'bg-green-50',
    },
    {
      icon: <CreditCard size={15} className="text-purple-500" />,
      label: 'CNIC',
      value: user?.cnic || 'Not set',
      bg: 'bg-purple-50',
    },
    {
      icon: <MapPin size={15} className="text-red-500" />,
      label: 'Address',
      value: user?.address || 'Not set',
      bg: 'bg-red-50',
    },
    {
      icon: <Calendar size={15} className="text-orange-500" />,
      label: 'Date of Birth',
      value: user?.dob?.split('T')[0] || 'Not set',
      bg: 'bg-orange-50',
    },
    {
      icon: <User size={15} className="text-pink-500" />,
      label: 'Gender',
      value: user?.gender || 'Not set',
      bg: 'bg-pink-50',
    },
    {
      icon: <Calendar size={15} className="text-gray-400" />,
      label: 'Member Since',
      value: user?.createdAt?.split('T')[0] || 'N/A',
      bg: 'bg-gray-50',
    },
  ];

  // Shared modal animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-primary via-blue-500 to-blue-400 relative flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <h1 className="text-4xl font-black text-white tracking-widest select-none">
              PrimeDrive
            </h1>

            {/* Profile pic */}
            <div className="absolute bottom-4 left-6">
              <div className="relative w-max">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  src={image ? URL.createObjectURL(image) : user?.image?.url || assets.upload_icon}
                  alt="profile"
                  className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg cursor-pointer shadow-md hover:bg-primary-dull transition"
                >
                  {imageLoading ? <span className="text-xs px-1">...</span> : <Camera size={13} />}
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Name and Buttons */}
          <div className="px-6 pb-6 pt-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Joined {user?.createdAt?.split('T')[0]}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-xl font-medium shadow-sm hover:bg-primary-dull transition cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  <Lock size={14} /> Password
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-base font-bold text-gray-700 mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition"
              >
                <div
                  className={`h-9 w-9 ${item.bg} flex items-center justify-center rounded-lg shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-700 break-words">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-3">
                {[
                  {
                    label: 'Full Name',
                    name: 'name',
                    type: 'text',
                    placeholder: 'Enter your name',
                  },
                  { label: 'Phone', name: 'phone', type: 'tel', placeholder: 'Enter phone number' },
                  { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter address' },
                  { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: '' },
                  {
                    label: 'CNIC',
                    name: 'cnic',
                    type: 'text',
                    placeholder: 'e.g. 35202-1234567-1',
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-primary transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-primary transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={14} /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-dull transition font-medium cursor-pointer"
                >
                  <Save size={14} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock size={15} className="text-primary" />
                  </div>
                  <h2 className="font-bold text-gray-800">Change Password</h2>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-3">
                {[
                  { label: 'Current Password', key: 'oldPassword', placeholder: '••••••••' },
                  { label: 'New Password', key: 'newPassword', placeholder: 'Min 6 characters' },
                  {
                    label: 'Confirm New Password',
                    key: 'confirmPassword',
                    placeholder: 'Re-enter new password',
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">
                      {field.label}
                    </label>
                    <input
                      type="password"
                      value={passwordForm[field.key]}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, [field.key]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-primary transition"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={14} /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-dull transition font-medium cursor-pointer"
                >
                  <Save size={14} />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
