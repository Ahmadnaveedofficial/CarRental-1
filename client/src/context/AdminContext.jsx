import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/me');
      if (data?.success) {
        setAdmin(data.data);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post('/api/v1/admin/login', { email, password });
      if (data?.success) {
        setAdmin(data.data.admin);
        toast.success('Welcome Admin!');
        navigate('/admin/dashboard');
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const logoutAdmin = async () => {
    try {
      await axios.post('/api/v1/admin/logout');
      setAdmin(null);
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const value = { admin, setAdmin, loading, loginAdmin, logoutAdmin, fetchAdmin };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdminContext = () => useContext(AdminContext);