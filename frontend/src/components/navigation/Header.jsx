import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationSystem from "../notifications/NotificationSystem";
import { LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMIN";
  
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/explore" style={{ marginTop: '8px' }}>
          🎬 CineMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ marginTop: '8px' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links for logged-in users */}
        <div className="collapse navbar-collapse" id="navbarNav" style={{ marginTop: '8px' }}>
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
                <Link className="nav-link" to="/recommendations">
                  Empfehlungen
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  id="socialDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-people-fill me-1"></i>
                  Social
                </a>
                <ul className="dropdown-menu" aria-labelledby="socialDropdown">
                  <li>
                    <Link className="dropdown-item" to="/friends">
                      <i className="bi bi-person-hearts me-2"></i>
                      Freunde
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/leaderboard">
                      <i className="bi bi-trophy-fill me-2"></i>
                      Rangliste
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/forum">
                      <i className="bi bi-chat-square-text me-2"></i>
                      Forum
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          )}

          {/* Admin Panel for admins */}
              {isLoggedIn && isAdmin && (
                <Link 
                  className="text-warning text-decoration-none me-3 d-flex align-items-center" 
                  to="/admin"
                  style={{ 
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.filter = 'drop-shadow(0 0 5px rgba(255, 193, 7, 0.5))';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.filter = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Admin Panel"
                >
                  <i className="bi bi-gear-fill me-1"></i>
                  Admin-Panel
                </Link>
              )}

          {isLoggedIn && (
            <div className="d-flex align-items-center">
              <NotificationSystem userId={userId} />
              
              {/* Show user role badge */}
              {userRole && (
                <span className={`badge me-3 ${isAdmin ? 'bg-warning text-dark' : 'bg-primary'}`}>
                  {userRole}
                </span>
              )}
              <button
                className="btn btn-sm btn-outline-light d-flex align-items-center"
                onClick={handleLogout}
                style={{ 
                  borderRadius: '8px',
                  padding: '6px 12px',
                  transition: 'all 0.2s ease'
                }}
                title="Abmelden"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;