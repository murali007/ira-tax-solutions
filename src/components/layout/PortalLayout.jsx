import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  User, 
  Clock, 
  MapPin, 
  Upload, 
  FileText, 
  Download, 
  LogOut, 
  Menu, 
  X,
  Users,
  CheckSquare,
  Mail,
  ChevronDown,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import './PortalLayout.css';

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fileNumber = user?.file_no || user?.fileNo || 'IRA-2026-47431';
  const status = user?.status || 'Profile Created';
  const userName = user?.name ? user.name.toUpperCase() : 'TAXPAYER';

  const isPersonalInfoActive = 
    location.pathname.includes('/portal/taxpayer') ||
    location.pathname.includes('/portal/spouse') ||
    location.pathname.includes('/portal/dependents');

  return (
    <div className="portal-container-root">
      {/* 1. Top Utility Bar: Unified Contact, File No & Status */}
      <div className="portal-top-black-bar">
        <div className="portal-top-black-inner">
          <div className="portal-top-contact-items">
            <span className="portal-top-item">
              <Mail size={13} className="portal-top-icon" />
              <a href="mailto:info@irataxsolutions.com">info@irataxsolutions.com</a>
            </span>
            <span className="portal-top-item">
              <span className="country-code-tag">IN</span>
              <a href="tel:+919014532499">+91 90145 32499</a>
              <span className="ext-badge-pill">Ext: 102</span>
            </span>
            <span className="portal-top-item whatsapp-item">
              <span className="chat-emoji">💬</span>
              <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer">WhatsApp Chat</a>
            </span>
          </div>

          <div className="portal-top-meta-group">
            <div className="file-badge-pill">
              <span className="meta-label">File No:</span>
              <strong className="meta-code">{fileNumber}</strong>
            </div>

            <div className="status-badge-chip">
              <span className="status-dot-pulse" />
              <span className="status-label">Status:</span>
              <strong className="status-name">{status}</strong>
            </div>

            <Link to="/" className="portal-top-nav-link">
              <ExternalLink size={12} /> Public Site
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Frosted Header Navbar: Brand, Actions & User Account */}
      <header className="portal-brand-row">
        <div className="portal-brand-inner">
          <div className="portal-brand-left-group">
            {/* Mobile Header Menu Trigger */}
            <button 
              type="button"
              className="portal-mobile-header-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Portal Sidebar"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="portal-top-logo">
              <CheckSquare size={26} className="logo-check-green" />
              <div className="logo-text-group">
                <span className="logo-part-dark">IRA</span>
                <span className="logo-part-green">Tax</span>
                <span className="logo-part-dark">Solutions</span>
              </div>
            </Link>

            <span className="portal-brand-badge">Client Portal</span>
          </div>

          {/* Right Action Group */}
          <div className="portal-brand-right-group">
            {/* Refer a Friend Callout */}
            <Link to="/refer" className="portal-center-referral">
              <Users size={16} className="refer-users-icon" />
              <span className="refer-title">Refer a Friend</span>
              <span className="refer-reward-badge">$40 Reward</span>
            </Link>

            {/* Book Consultation Button */}
            <Link to="/contact" className="portal-consult-header-btn">
              <Calendar size={14} /> Book Free Consultation
            </Link>

            {/* User Account Corner */}
            <div className="portal-user-corner" ref={userMenuRef}>
              <button
                type="button"
                className="portal-user-pill-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar-circle">
                  <User size={14} />
                </div>
                <span className="user-greeting">Hi, {userName}</span>
                <ChevronDown size={13} className="chevron-icon" />
              </button>

              {userMenuOpen && (
                <div className="portal-user-dropdown">
                  <div className="dropdown-user-header">
                    <strong>{user?.name || 'Taxpayer'}</strong>
                    <span>{user?.email || 'Registered Filer'}</span>
                  </div>
                  <hr />
                  <Link to="/" onClick={() => setUserMenuOpen(false)}>
                    <ExternalLink size={13} /> Public Home
                  </Link>
                  <Link to="/security" onClick={() => setUserMenuOpen(false)}>
                    <ShieldCheck size={13} /> Security &amp; Privacy
                  </Link>
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Portal Main Workspace Body */}
      <div className="portal-workspace-body">
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`portal-sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Left Dark Sidebar Navbar */}
        <aside className={`portal-dark-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-nav-container">
            <div className="sidebar-header-label">PORTAL NAVIGATION</div>
            <nav className="portal-vertical-nav">
              <NavLink 
                to="/portal" 
                end
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="menu-icon" size={17} />
                <span>Dashboard Home</span>
              </NavLink>

              {/* Collapsible Personal Information Group */}
              <div className="sidebar-group-wrapper">
                <button 
                  type="button" 
                  className={`group-header-btn ${isPersonalInfoActive ? 'group-active' : ''}`}
                  onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
                >
                  <div className="group-header-left">
                    <User className="menu-icon" size={17} />
                    <span>Personal Information</span>
                  </div>
                  <ChevronDown size={14} className={`group-chevron ${personalInfoOpen ? 'rotated' : ''}`} />
                </button>

                {personalInfoOpen && (
                  <div className="group-sublinks-container">
                    <NavLink 
                      to="/portal/taxpayer" 
                      className={({ isActive }) => `sublink-item ${isActive ? 'sub-active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sublink-dot" />
                      <span>Taxpayer Info</span>
                    </NavLink>

                    <NavLink 
                      to="/portal/spouse" 
                      className={({ isActive }) => `sublink-item ${isActive ? 'sub-active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sublink-dot" />
                      <span>Spouse Info</span>
                    </NavLink>

                    <NavLink 
                      to="/portal/dependents" 
                      className={({ isActive }) => `sublink-item ${isActive ? 'sub-active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sublink-dot" />
                      <span>Dependent Info</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink 
                to="/portal/schedule" 
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clock className="menu-icon" size={17} />
                <span>Schedule &amp; Tax Notes</span>
              </NavLink>

              <NavLink 
                to="/portal/address" 
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="menu-icon" size={17} />
                <span>Address Information</span>
              </NavLink>

              <NavLink 
                to="/portal/upload" 
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload className="menu-icon" size={17} />
                <span>Upload Tax Documents</span>
              </NavLink>

              <NavLink 
                to="/portal/summary" 
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="menu-icon" size={17} />
                <span>Tax Summary</span>
              </NavLink>

              <NavLink 
                to="/portal/download" 
                className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Download className="menu-icon" size={17} />
                <span>Download Tax Returns</span>
              </NavLink>
            </nav>
          </div>

          {/* Sidebar Footer Trust Card */}
          <div className="sidebar-trust-box">
            <div className="trust-box-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="trust-box-text">
              <strong>IRS Authorized e-File</strong>
              <span>256-Bit Bank Encryption</span>
            </div>
          </div>
        </aside>

        {/* Mobile Toggle FAB (Floating Action Button) */}
        <button 
          className="portal-mobile-fab"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Portal Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Workspace Content Canvas */}
        <main className="portal-canvas-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
