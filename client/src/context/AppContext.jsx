import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  // function if check user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/v1/users/data');
      if (data?.success) {
        setUser(data.data);
        setIsOwner(data.data?.role === 'owner');
      } else {
        // navigate('/');
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setIsOwner(false);
        return;
      }
      toast.error(error?.response?.data?.message || error.message);
      setUser(null);
      setIsOwner(false);
    } finally {
      setLoading(false);
    }
  };

  // function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/v1/users/cars');
      // console.log("API RESPONSE:", data);
      data.success ? setCars(data.data) : toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/v1/blogs/');
      console.log(data)
      data.success ? setBlogs(data.data) : toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
useEffect(() => {
    // sirf non-auth routes par retry karo
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        //  Yeh routes par retry bilkul mat karo
        const skipRetryUrls = [
          '/api/v1/users/data',
          '/api/v1/users/refresh-token',
          '/api/v1/users/login',
        ];

        const shouldSkip = skipRetryUrls.some((url) =>
          originalRequest.url?.includes(url)
        );

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !shouldSkip
        ) {
          originalRequest._retry = true;
          try {
            await axios.post('/api/v1/users/refresh-token');
            return axios(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setIsOwner(false);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  // function to handle logout
  const logout = async () => {
    try {
      const { data } = await axios.post('/api/v1/users/logout');
      if (data?.success) {
        setUser(null);
        setIsOwner(false);
        navigate('/');
        toast.success(data?.message || 'Logged out successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchUser();
    fetchBlogs();
  }, []);
// const init = async () => {
//     await Promise.all([fetchUser(), fetchCars()]);
//   };
//   useEffect(() => {
//   init();
// }, []);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    loading,
    blogs,
    setBlogs,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
