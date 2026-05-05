import { useAdminContext } from '../../context/AdminContext';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const { admin, loading } = useAdminContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;