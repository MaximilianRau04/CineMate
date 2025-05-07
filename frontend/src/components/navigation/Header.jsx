import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); 

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
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin-Panel
                </Link>
              </li>
            </ul>
          )}

          {isLoggedIn && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
