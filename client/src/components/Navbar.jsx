import React, { useState, useRef, useEffect } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown.jsx';
import {motion} from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, axios,fetchUser } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/v1/owners/change-role');
      if (data?.success) {
         await fetchUser();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while changing role');
    }
  };

  return (
    <motion.div
    initial={{y:-20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}
      className={`flex items-center justify-between h-20 px-6 md:px-16 lg:px-24
        xl:px-32 py-4 text-gray-800 border-b border-borderColor relative transition-all 
        ${location.pathname === '/' && 'bg-light'}`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img whileHover={{scale:1.05}} className="h-10" src={assets.logo} alt="logo" />
      </Link>

      {/* Desktop + Mobile Sidebar Menu */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
            max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
            items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4   
            transition-all duration-300 z-50 
            ${location.pathname === '/' ? 'bg-light' : 'bg-white'} 
            ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="hover:text-primary transition-colors font-medium"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Search - Desktop only */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            placeholder="Search"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Desktop: Profile / Login */}
        <div className="hidden sm:flex items-center gap-5">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className=" cursor-pointer flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all bg-white"
              >
                <img
               
                  src={user?.image?.url }
                   onError={(e) => {
                  if (e.target.src !== assets.upload_icon) {
                    e.target.src = assets.upload_icon;
                  }
                }}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <ProfileDropdown
                  setDropdownOpen={setDropdownOpen}
                  setOpen={setOpen}
                  changeRole={changeRole}
                />
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile: Profile Avatar + Hamburger */}
      <div className="sm:hidden flex items-center gap-3">
        {user ? (
          <div className="relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 p-1 pr-2 rounded-full border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all bg-white"
            >
              <img
                src={user.image?.url || assets.upload_icon}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {dropdownOpen && (
              <ProfileDropdown
                setDropdownOpen={setDropdownOpen}
                setOpen={setOpen}
                changeRole={changeRole}
              />
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="cursor-pointer px-4 py-1.5 bg-primary hover:bg-primary-dull transition-all text-white text-sm rounded-lg"
          >
            Login
          </button>
        )}

        {/* Hamburger */}
        <button className="cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      </div>

    </motion.div>
  );
};

export default Navbar;