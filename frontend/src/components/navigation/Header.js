import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/movies">
          🎬 CineMate
        </Link>

        {/* Toggle Button (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/movies">
                Filmsammlung
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
          </ul>

          {/* Optionaler Logout-Button */}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
