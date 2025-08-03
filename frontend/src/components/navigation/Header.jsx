import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationSystem from "../notifications/NotificationSystem";
import { LogOut } from 'lucide-react';
import { useAuth } from "../../utils/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();

  const userRole = user?.role;
  const isAdmin = userRole === "ADMIN";
  
  const userId = user?.id;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid px-2 px-md-3">

        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/explore">
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <span className="ms-2 d-none d-md-inline">CineMate</span>
          <span className="ms-2 d-inline d-md-none d-none d-sm-inline">CM</span>
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler border-0 p-1 ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated && (
            <>
              {/* Main navigation */}
              <ul className="navbar-nav me-auto flex-wrap">
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/explore">
                    <i className="bi bi-compass d-xl-none me-1"></i>
                    <span className="d-none d-xl-inline">Erkunden</span>
                    <span className="d-xl-none">Erkunden</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/watchlist">
                    <i className="bi bi-bookmark d-xl-none me-1"></i>
                    <span className="d-none d-xl-inline">Watchlist</span>
                    <span className="d-xl-none">Watchlist</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/calendar">
                    <i className="bi bi-calendar d-xl-none me-1"></i>
                    <span className="d-none d-xl-inline">Kalender</span>
                    <span className="d-xl-none">Kalender</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/profile">
                    <i className="bi bi-person d-xl-none me-1"></i>
                    <span className="d-none d-xl-inline">Profil</span>
                    <span className="d-xl-none">Profil</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/statistics">
                    <i className="bi bi-graph-up me-1"></i>
                    <span className="d-none d-lg-inline">Statistiken</span>
                    <span className="d-lg-none">Stats</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/achievements">
                    <i className="bi bi-trophy me-1"></i>
                    <span className="d-none d-lg-inline">Achievements</span>
                    <span className="d-lg-none">Awards</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/recommendations">
                    <i className="bi bi-stars d-xl-none me-1"></i>
                    <span className="d-none d-lg-inline">Empfehlungen</span>
                    <span className="d-lg-none">Tipps</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-2 px-lg-3" to="/lists">
                    <i className="bi bi-list-ul d-xl-none me-1"></i>
                    <span className="d-none d-lg-inline">Listen</span>
                    <span className="d-lg-none">Listen</span>
                  </Link>
                </li>
                
                {/* Social Dropdown */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle px-2 px-lg-3" 
                    href="#" 
                    id="socialDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="bi bi-people-fill me-1"></i>
                    <span className="d-none d-lg-inline">Social</span>
                    <span className="d-lg-none">Social</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start" aria-labelledby="socialDropdown">
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

              {/* Right side content */}
              <div className="d-flex align-items-center flex-wrap gap-2 mt-2 mt-xl-0">
                {/* Admin Panel */}
                {isAdmin && (
                  <Link 
                    className="text-warning text-decoration-none d-flex align-items-center order-3 order-xl-1" 
                    to="/admin"
                    style={{ 
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
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
                    <span className="d-none d-lg-inline">Admin-Panel</span>
                    <span className="d-lg-none">Admin</span>
                  </Link>
                )}

                {/* Notifications */}
                <div className="order-1 order-xl-2">
                  <NotificationSystem userId={userId} />
                </div>
                
                {/* Role Badge */}
                {userRole && (
                  <span className={`badge order-2 order-xl-3 ${isAdmin ? 'bg-warning text-dark' : 'bg-primary'}`}
                        style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {userRole}
                  </span>
                )}

                {/* Logout Button */}
                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center order-4"
                  onClick={handleLogout}
                  style={{ 
                    borderRadius: '8px',
                    padding: '6px 12px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  title="Abmelden"
                >
                  <LogOut size={18} />
                  <span className="ms-2 d-none d-lg-inline">Abmelden</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;