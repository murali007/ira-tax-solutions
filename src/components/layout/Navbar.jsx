import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckSquare, Lock, UserPlus } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT US' },
  { to: '/services', label: 'SERVICES' },
  { to: '/pricing', label: 'PRICING' },
  { to: '/security', label: 'SECURITY & PRIVACY' },
  { to: '/refund-status', label: 'IRS REFUND STATUS' },
  { to: '/refer', label: 'REFER & EARN' },
  { to: '/contact', label: 'BOOK CONSULTATION' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="site-header">
      {/* Top Black Info Bar */}
      <div className="top-black-bar">
        <div className="top-black-inner">
          <div className="top-contact-items">
            <span className="top-item">
              <Mail size={13} className="top-icon" />
              <a href="mailto:info@irataxsolutions.com">info@irataxsolutions.com</a>
            </span>
            <span className="top-item">
              <span className="country-code-tag">IN</span>
              <a href="tel:+919014532499">+91 90145 32499</a>
            </span>
            <span className="top-item whatsapp-item">
              <span className="flag-icon">💬</span>
              <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer">WhatsApp Chat</a>
            </span>
          </div>

          <div className="top-auth-items">
            {isAuthenticated ? (
              <span className="welcome-text">
                👤 Welcome, <strong>{user?.name || 'Taxpayer'}</strong>
              </span>
            ) : (
              <div className="top-auth-links-group">
                <Link to="/login" className="top-auth-link">
                  <Lock size={12} /> Login
                </Link>
                <span className="top-divider">|</span>
                <Link to="/register" className="top-auth-link">
                  <UserPlus size={12} /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main White Navbar */}
      <nav className="main-navbar">
        <div className="main-navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={closeMobile}>
            <div className="logo-badge">
              <CheckSquare size={34} className="logo-check-icon" />
            </div>
            <div className="logo-text-group">
              <span className="logo-title-dark">IRA</span>
              <span className="logo-title-green">Tax</span>
              <span className="logo-title-dark">Solutions</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-menu-desktop">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Account / Auth Actions */}
          <div className="nav-actions-desktop" ref={dropdownRef}>
            {isAuthenticated ? (
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User Menu"
                >
                  <span className="user-avatar-circle">
                    {(user?.name || 'T')[0].toUpperCase()}
                  </span>
                  <span className="user-name-display">{user?.name}</span>
                  <span className="caret-arrow">▼</span>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-info">
                      <strong>{user?.name}</strong>
                      <small>{user?.email}</small>
                    </div>
                    <hr />
                    <Link to="/portal" onClick={() => setDropdownOpen(false)}>
                      Go to Tax Filing Portal
                    </Link>
                    <Link to="/security" onClick={() => setDropdownOpen(false)}>
                      Security &amp; Privacy
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="logout-btn">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-buttons-group">
                <Link to="/login" className="nav-login-btn">
                  Login
                </Link>
                <Link to="/register" className="nav-register-btn">
                  Register
                </Link>
                <Link to="/portal" className="portal-cta-btn">
                  PORTAL
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`mobile-toggle-btn ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="mobile-nav-drawer">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mobile-auth-section">
              {isAuthenticated ? (
                <>
                  <div className="mobile-user-greeting">
                    <span className="user-avatar-circle">
                      {(user?.name || 'T')[0].toUpperCase()}
                    </span>
                    <span>Hi, <strong>{user?.name}</strong></span>
                  </div>
                  <Link to="/portal" onClick={closeMobile} className="mobile-auth-btn primary">
                    Tax Filing Portal
                  </Link>
                  <button onClick={() => { handleLogout(); closeMobile(); }} className="mobile-auth-btn outline">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="mobile-guest-auth-actions">
                  <div className="mobile-auth-row">
                    <Link to="/login" onClick={closeMobile} className="mobile-auth-btn outline">
                      Login
                    </Link>
                    <Link to="/register" onClick={closeMobile} className="mobile-auth-btn outline">
                      Register
                    </Link>
                  </div>
                  <Link to="/portal" onClick={closeMobile} className="mobile-auth-btn primary">
                    Open Client Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
