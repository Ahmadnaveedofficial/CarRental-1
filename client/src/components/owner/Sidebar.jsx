import React, { useState } from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets.js';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState();

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      const { data } = await axios.post('/api/v1/owners/update-profile-image', formData);
      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/*  Desktop Sidebar */}
      <div className="hidden md:flex relative min-h-screen flex-col items-center pt-8 w-60 border-r border-borderColor text-sm flex-shrink-0">
        {/* Profile Image */}
        <div className="group relative">
          <label htmlFor="image-desktop" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : user?.image?.url}
              alt="profile"
              className="h-14 w-14 rounded-full mx-auto object-cover"
            />
            <input
              type="file"
              id="image-desktop"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/10 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer">
              <img src={assets.edit_icon} alt="edit" className="w-5 h-5" />
            </div>
          </label>
        </div>

        {/* Save button */}
        {image && (
          <button
            className="absolute top-2 right-4 flex items-center p-2 gap-1 bg-primary/10 text-primary cursor-pointer rounded-md shadow-md transition-all text-xs"
            onClick={updateImage}
          >
            Save
            <img src={assets.check_icon} width={13} alt="" />
          </button>
        )}

        <p className="mt-2 text-base font-medium text-gray-700 truncate px-4 text-center">
          {user?.name}
        </p>

        {/* Nav Links */}
        <div className="w-full mt-6">
          {ownerMenuLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={`relative flex items-center gap-3 w-full py-3 pl-5 ${
                link.path === location.pathname
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50'
              } transition`}
            >
              <img
                src={link.path === location.pathname ? link.coloredIcon : link.icon}
                alt={link.name}
                className="w-5 h-5"
              />
              <span>{link.name}</span>
              <div
                className={`${
                  link.path === location.pathname ? 'bg-primary' : ''
                } w-1.5 h-8 rounded-l right-0 absolute`}
              />
            </NavLink>
          ))}
        </div>
      </div>

      {/*  Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center h-14">
          {ownerMenuLinks.map((link, index) => {
            const isActive = link.path === location.pathname;
            return (
              <NavLink
                key={index}
                to={link.path}
                title={link.name}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <img
                  src={isActive ? link.coloredIcon : link.icon}
                  alt={link.name}
                  className="w-5 h-5"
                />
                <span className="text-[9px] font-medium leading-none">{link.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile bottom padding spacer */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default Sidebar;
