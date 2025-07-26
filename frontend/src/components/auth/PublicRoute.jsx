import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return children;
};

export default PublicRoute;
