import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/explore">
          🎬 CineMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links for logged-in users */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/explore">
                  Erkunden
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/watchlist">
                  Watchlist
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/calendar">
                  Kalender
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profil
                </Link>
              </li>
              {/* Admin Panel for admins */}
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin">
                    <i className="fas fa-shield-alt me-1"></i>
                    Admin-Panel
                  </Link>
                </li>
              )}
            </ul>
          )}

          {isLoggedIn && (
            <div className="d-flex align-items-center">
              {/* Show user role badge */}
              {userRole && (
                <span className={`badge me-3 ${isAdmin ? 'bg-warning text-dark' : 'bg-primary'}`}>
                  {userRole}
                </span>
              )}
              <button
                className="btn btn-sm btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;