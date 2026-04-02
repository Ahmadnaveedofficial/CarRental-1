import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets';

const ProfileDropdown = ({ setDropdownOpen, setOpen, changeRole }) => {
  const { user, logout, isOwner } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className=" absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      
      {/* Header */}
      <div className="relative px-5 pt-5 pb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-50 rounded-t-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <img
              src={user.image?.url || assets.upload_icon}
              alt="profile"
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 truncate mb-1">{user.email}</p>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium 
              ${isOwner ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
              {isOwner ? 'Owner' : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-2 py-2">
        <button
          onClick={() => { navigate('/my-bookings'); setDropdownOpen(false); setOpen(false); }}
          className="cursor-pointer w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition group"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
            <BookOpen size={15} className="text-blue-500" />
          </div>
          <div>
            <p className="font-medium">My Bookings</p>
            <p className="text-xs text-gray-400">View your reservations</p>
          </div>
        </button>

        <button
          onClick={() => { isOwner ? navigate('/owner') : changeRole(); setDropdownOpen(false); setOpen(false); }}
          className="cursor-pointer w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition group"
        >
          <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
            <LayoutDashboard size={15} className="text-green-500" />
          </div>
          <div>
            <p className="font-medium">{isOwner ? 'Dashboard' : 'List your items'}</p>
            <p className="text-xs text-gray-400">{isOwner ? 'Manage your listings' : 'Become a owner'}</p>
          </div>
        </button>

        <button
          onClick={() => { navigate('/profile'); setDropdownOpen(false); setOpen(false); }}
          className="cursor-pointer w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition group"
        >
          <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
            <User size={15} className="text-purple-500" />
          </div>
          <div>
            <p className="font-medium">Profile</p>
            <p className="text-xs text-gray-400">Manage your account</p>
          </div>
        </button>
      </div>

      {/* Logout */}
      <div className="px-2 pb-2 border-t border-gray-100 pt-2">
        <button
          onClick={() => { logout(); setDropdownOpen(false); setOpen(false); }}
          className="cursor-pointer w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition group"
        >
          <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition">
            <LogOut size={15} className="text-red-500" />
          </div>
          <div>
            <p className="font-medium">Logout</p>
            <p className="text-xs text-red-300">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;