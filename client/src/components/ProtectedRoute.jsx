import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
