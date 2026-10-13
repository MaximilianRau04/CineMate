import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import NotificationSystem from "../notifications/NotificationSystem";
import { LogOut, Menu, X, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import { useTranslation } from "../../i18n/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Header.css";

const MAIN_LINKS = [
  { to: "/explore", key: "nav.explore", icon: "bi-compass" },
  { to: "/calendar", key: "nav.calendar", icon: "bi-calendar3" },
  { to: "/watchlist", key: "nav.watchlist", icon: "bi-bookmark" },
  { to: "/lists", key: "nav.lists", icon: "bi-collection" },
  { to: "/recommendations", key: "nav.recommendations", icon: "bi-stars" },
];

const COMMUNITY_LINKS = [
  { to: "/friends", key: "nav.friends", icon: "bi-person-hearts" },
  { to: "/leaderboard", key: "nav.leaderboard", icon: "bi-trophy" },
  { to: "/forum", key: "nav.forum", icon: "bi-chat-square-text" },
];

const ACCOUNT_LINKS = [
  { to: "/profile", key: "nav.profile", icon: "bi-person" },
  { to: "/statistics", key: "nav.statistics", icon: "bi-graph-up" },
  { to: "/achievements", key: "nav.achievements", icon: "bi-award" },
];

/**
 * Small dropdown that closes on outside click.
 */
const NavDropdown = ({ label, icon, links, active, align = "start" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="cm-dd" ref={ref}>
      <button
        type="button"
        className={`cm-nav-link cm-dd-toggle${active ? " active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown size={14} className={`cm-dd-chev${open ? " up" : ""}`} />
      </button>
      {open && (
        <div className={`cm-dd-menu cm-dd-${align}`} role="menu">
          {links.map((link) =>
            link.divider ? (
              <div key={link.key} className="cm-dd-divider" />
            ) : link.onClick ? (
              <button
                key={link.key}
                type="button"
                className="cm-dd-item"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  link.onClick();
                }}
              >
                <i className={`bi ${link.icon}`} />
                {t(link.key)}
              </button>
            ) : (
              <NavLink
                key={link.key}
                to={link.to}
                className="cm-dd-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${link.icon}`} />
                {t(link.key)}
              </NavLink>
            ),
          )}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const userId = user?.id;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (links) =>
    links.some((link) => link.to && location.pathname.startsWith(link.to));

  const initials = (user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <header className="cm-header">
      <div className="cm-header-inner">
        <Link className="cm-brand" to="/explore" aria-label="CineMate">
          <span className="cm-brand-mark" aria-hidden="true" />
          <span>
            CINE<span className="cm-brand-accent">MATE</span>
          </span>
        </Link>

        {isAuthenticated && (
          <>
            <nav className="cm-nav" aria-label={t("nav.main")}>
              {MAIN_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className="cm-nav-link">
                  {t(link.key)}
                </NavLink>
              ))}
              <NavDropdown
                label={t("nav.community")}
                links={COMMUNITY_LINKS}
                active={isActive(COMMUNITY_LINKS)}
              />
            </nav>

            <div className="cm-header-actions">
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="cm-icon-btn cm-admin-link"
                  title={t("nav.admin")}
                  aria-label={t("nav.admin")}
                >
                  <Settings size={19} />
                </NavLink>
              )}

              <NotificationSystem userId={userId} />

              <LanguageSwitcher className="d-none d-sm-inline-flex" />

              <div className="d-none d-lg-block">
                <NavDropdown
                  align="end"
                  active={isActive(ACCOUNT_LINKS)}
                  icon={
                    <span className="cm-avatar" aria-hidden="true">
                      {initials}
                    </span>
                  }
                  label={<span className="cm-user-name">{user?.username}</span>}
                  links={[
                    ...ACCOUNT_LINKS,
                    { key: "divider", divider: true },
                    {
                      key: "nav.logout",
                      icon: "bi-box-arrow-right",
                      onClick: handleLogout,
                    },
                  ]}
                />
              </div>

              <button
                type="button"
                className="cm-icon-btn d-lg-none"
                onClick={() => setMobileOpen((o) => !o)}
                aria-expanded={mobileOpen}
                aria-label={t("nav.toggleMenu")}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {isAuthenticated && mobileOpen && (
        <div className="cm-mobile-panel d-lg-none">
          <div className="cm-mobile-user">
            <span className="cm-avatar">{initials}</span>
            <div>
              <div className="fw-semibold">{user?.username}</div>
              <div className="cm-eyebrow">{user?.role}</div>
            </div>
            <LanguageSwitcher className="ms-auto" />
          </div>
          {[
            { title: t("nav.browse"), links: MAIN_LINKS },
            { title: t("nav.community"), links: COMMUNITY_LINKS },
            { title: t("nav.account"), links: ACCOUNT_LINKS },
          ].map((group) => (
            <div key={group.title} className="cm-mobile-group">
              <div className="cm-eyebrow">{group.title}</div>
              {group.links.map((link) => (
                <NavLink key={link.to} to={link.to} className="cm-mobile-link">
                  <i className={`bi ${link.icon}`} />
                  {t(link.key)}
                </NavLink>
              ))}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-light w-100 mt-2"
            onClick={handleLogout}
          >
            <LogOut size={16} className="me-2" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
