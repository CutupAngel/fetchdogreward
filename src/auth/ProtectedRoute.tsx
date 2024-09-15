import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const ProtectedRoute: React.FC<{ component: React.FC }> = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  return <Component />;
};

export default ProtectedRoute;
