
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets.js';
import {GoogleLogin} from "@react-oauth/google"

const Login = () => {
  const { setShowLogin, axios, navigate, setUser } = useAppContext();

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      if (state === 'register') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('cnic', cnic);
        if (address) formData.append('address', address);
        if (dob) formData.append('dob', dob);
        if (gender) formData.append('gender', gender);
        if (image) formData.append('image', image);

        const { data } = await axios.post('/api/v1/users/register', formData);
        if (data?.success) {
          setState('login');
          toast.success('Account created! Please login.');
        } else {
          toast.error(data?.message);
        }
      } else {
        const { data } = await axios.post('/api/v1/users/login', { email, password });
        if (data?.success) {
          navigate('/');
          setUser(data.data.user);
          console.log(data);
          setShowLogin(false);
          toast.success(data?.message || 'Success');
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await axios.post('/api/v1/auth/google', {
        credential: response.credential,
      });
      if (data?.success) {
        navigate('/');
        setUser(data.data.user);
        setShowLogin(false);
        toast.success(data?.message || 'Google login successful');
        
      } else {
        toast.error(data?.message  || "hello ");
        console.log("RESPONSE:", data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "hello ");
    }
  };
  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-gray-500 w-full max-w-96 mx-4 md:p-8 p-6 text-left text-sm rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">
          {state === 'login' ? 'Welcome back' : 'Create Account'}
        </h2>
        <p className="text-center mb-6 text-gray-500">
          {state === 'login' ? 'Please login to continue' : 'Join us to start booking'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'register' && (
            <>
              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <label htmlFor="register-image" className="cursor-pointer">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload_icon}
                    className="h-16 w-16 rounded-full object-cover border-2 border-indigo-300"
                    alt="profile"
                  />
                  <input
                    type="file"
                    id="register-image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>

              {/* 1. Full Name */}
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="text"
                placeholder="Full Name"
                required
              />
              {/* 2. Email */}
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="email"
                placeholder="Email Address"
                required
              />
              {/* 3. Phone */}
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="tel"
                placeholder="Phone Number"
                required
              />
              {/* 4. CNIC */}
              <input
                onChange={(e) => setCnic(e.target.value)}
                value={cnic}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="text"
                placeholder="CNIC (e.g. 35201-1234567-1)"
                required
              />
              {/* 5. Address - Optional */}
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="text"
                placeholder="Address (Optional)"
              />
              {/* 6. Date of Birth - Optional */}
              <input
                onChange={(e) => setDob(e.target.value)}
                value={dob}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="date"
              />
              {/* 7. Gender - Optional */}
              <select
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
              >
                <option value="">Select Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {/* 8. Password */}
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {state === 'login' && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full bg-transparent border mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="email"
                placeholder="Enter your email"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500"
                type="password"
                placeholder="Enter your password"
                required
              />
              <div className="text-right py-3">
                <a className="text-primary hover:text-primary-dull text-xs" href="#">
                  Forgot Password?
                </a>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-4 cursor-pointer mb-3 bg-indigo-600 py-2.5 rounded-full text-white font-medium hover:bg-indigo-700 transition-all"
          >
            {state === 'login' ? 'Log in' : 'Create Account'}
          </button>
        </form>

        {state === 'login' ? (
          <p className="text-center mt-2">
            Don't have an account?{' '}
            <span onClick={() => setState('register')} className="text-indigo-600 cursor-pointer hover:underline font-medium">
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-center mt-2">
            Already have an account?{' '}
            <span onClick={() => setState('login')} className="text-indigo-600 cursor-pointer hover:underline font-medium">
              Login
            </span>
          </p>
        )}

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
          <p className="mx-4 text-gray-400">or</p>
        </div>

        {/* <button
          type="button"
          className="w-full cursor-pointer flex items-center gap-2 justify-center bg-white border border-gray-300 py-2.5 rounded-full text-gray-700 hover:bg-gray-50 transition-all"
        >
          <img
            className="h-4 w-4"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
            alt="google"
          />
          Continue with Google
        </button> */}
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Login Failed')}
            text="continue_with"
            shape="pill"
            theme="outline"
            size="large"
            width="320"
          />
      </div>
    </div>
  );
};

export default Login;