import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Wenn kein Token vorhanden ist, wird der Benutzer zur Login-Seite umgeleitet
    return <Navigate to="/login" />;
  }

  // Wenn das Token vorhanden ist, wird die geschützte Seite angezeigt
  return children;
};

export default PrivateRoute;
