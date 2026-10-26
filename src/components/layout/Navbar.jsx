import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Lock, User, CheckSquare } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT US' },
  { to: '/services', label: 'SERVICES' },
  { to: '/pricing', label: 'PRICING' },
  { to: '/refund-status', label: 'REFUND STATUS' },
  { to: '/refer', label: 'REFER & EARN' },
  { to: '/contact', label: 'CONTACT US' },
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
      {/* Top Black Info Bar matching Clip 1 */}
      <div className="top-black-bar">
        <div className="top-black-inner">
          <div className="top-contact-items">
            <span className="top-item">
              <Mail size={13} className="top-icon" />
              <a href="mailto:contact@irataxsolutions.com">contact@irataxsolutions.com</a>
            </span>
            <span className="top-item">
              <span className="flag-icon">🇮🇳</span>
              <a href="tel:+919121157586">+91 91211 57586</a>
            </span>
            <span className="top-item">
              <span className="flag-icon">🇮🇳</span>
              <a href="tel:+917207057471">+91 72070 57471</a>
            </span>
            <span className="top-item">
              <span className="flag-icon">💬</span>
              <a href="https://wa.me/919121157586" target="_blank" rel="noreferrer">WhatsApp Chat</a>
            </span>
          </div>

          <div className="top-auth-items">
            {isAuthenticated ? (
              <span className="welcome-text">
                👤 Welcome, <strong>{user?.name || 'Taxpayer'}</strong>
              </span>
            ) : (
              <>
                <Link to="/login" className="top-auth-link">
                  <Lock size={12} /> Login
                </Link>
                <span className="top-divider">|</span>
                <Link to="/register" className="top-auth-link">
                  <User size={12} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main White Navbar */}
      <nav className="main-navbar">
        <div className="main-navbar-inner">
          {/* Logo matching Clip 1 */}
          <Link to="/" className="brand-logo">
            <div className="logo-badge">
              <CheckSquare size={28} className="logo-check-icon" />
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

          {/* User Account / Portal CTA */}
          <div className="nav-actions-desktop" ref={dropdownRef}>
            {isAuthenticated ? (
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="user-avatar-circle">
                    {(user?.name || 'T')[0].toUpperCase()}
                  </span>
                  <span className="user-name-display">{user?.name}</span>
                  <span className="caret-arrow">▼</span>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <Link to="/portal" onClick={() => setDropdownOpen(false)}>
                      Go to Tax Filing Portal
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="logout-btn">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="portal-cta-btn">
                CLIENT PORTAL
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`mobile-toggle-btn ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Dropdown */}
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
                  <Link to="/portal" onClick={closeMobile} className="mobile-auth-btn primary">
                    Tax Filing Portal
                  </Link>
                  <button onClick={() => { handleLogout(); closeMobile(); }} className="mobile-auth-btn outline">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobile} className="mobile-auth-btn primary">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={closeMobile} className="mobile-auth-btn outline">
                    Register Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
