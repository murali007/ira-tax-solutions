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
              <span className="country-flag-icon" role="img" aria-label="India">🇮🇳</span>
              <a href="tel:+919014532499">+91 90145 32499</a>
            </span>
            <span className="top-item whatsapp-item whatsapp-highlight-pulse">
              <svg className="whatsapp-official-icon" viewBox="0 0 24 24" width="15" height="15" fill="#25D366" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.999-.047-.282-.09-.645-.214-1.11-.416-1.938-.838-3.21-2.793-3.308-2.923-.098-.13-1.002-1.332-1.002-2.54 0-1.208.631-1.802.855-2.047.224-.245.489-.306.652-.306.163 0 .326.002.469.009.151.008.354-.057.553.421.204.489.693 1.691.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.107.502.143.245.636 1.05 1.365 1.701.939.837 1.731 1.097 1.976 1.22.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.551-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.592-.083.997z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.436 5.178L2 22l4.981-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.174c-1.637 0-3.17-.468-4.472-1.28l-.321-.2-3.084.866.829-3.029-.211-.336C3.844 14.858 3.326 13.47 3.326 12c0-4.783 3.891-8.674 8.674-8.674 4.783 0 8.674 3.891 8.674 8.674 0 4.783-3.891 8.674-8.674 8.674z"/>
              </svg>
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
            <img src="/ira-logo.png" alt="IRA Tax Solutions Logo" className="header-company-logo" />
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
              <div className="nav-auth-buttons-group">
                <Link to="/portal" className="portal-cta-btn">
                  PORTAL
                </Link>
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
              </div>
            ) : (
              <div className="nav-auth-buttons-group">
                <Link to="/login" className="nav-login-btn">
                  Login
                </Link>
                <Link to="/register" className="nav-register-btn">
                  Register
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
                    <Link to="/register" onClick={closeMobile} className="mobile-auth-btn primary">
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
