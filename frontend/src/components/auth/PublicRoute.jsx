import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="cm-spinner vh-100" role="status">
        <div className="cm-reel" />
        <span className="visually-hidden">Loading</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return children;
};

export default PublicRoute;
