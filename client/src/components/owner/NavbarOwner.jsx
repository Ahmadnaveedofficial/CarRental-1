import React from 'react';
import { assets } from '../../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { ArrowLeftRight } from 'lucide-react';

const NavbarOwner = () => {
  const { axios, fetchUser } = useAppContext();
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/v1/owners/change-role');
      if (data?.success) {
        await fetchUser();
        toast.success('Switched to user mode');
        navigate('/');
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 h-16 md:h-20">
        {/* Left Logo */}
        <Link to="/owner">
          <img src={assets.logo} alt="logo" className="h-09 md:h-10" />
        </Link>

        {/* Right Switch Button */}
        <button
          onClick={changeRole}
          className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 bg-primary text-white rounded-xl cursor-pointer font-semibold shadow-md shadow-primary/20 transition hover:opacity-90"
        >
          <ArrowLeftRight size={14} />
          <span>Switch to User</span>
        </button>
      </div>
    </div>
  );
};

export default NavbarOwner;
