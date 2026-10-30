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
  ChevronDown
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

  const fileNumber = user?.file_no || user?.fileNo || '240005';
  const status = user?.status || 'Scheduling Pending';
  const userName = user?.name ? user.name.toUpperCase() : 'TAXPAYER';

  const isPersonalInfoActive = 
    location.pathname.includes('/portal/taxpayer') ||
    location.pathname.includes('/portal/spouse') ||
    location.pathname.includes('/portal/dependents');

  return (
    <div className="portal-container-root">
      {/* 1. Portal Brand & Contact Row */}
      <div className="portal-brand-row">
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
          </div>

          {/* Center Referral Callout */}
          <Link to="/refer" className="portal-center-referral">
            <Users size={22} className="refer-users-icon" />
            <div className="refer-text-col">
              <span className="refer-title">REFER A FRIEND</span>
              <span className="refer-sub">&amp; Earn $40 Reward</span>
            </div>
          </Link>

          {/* Contact Direct Numbers */}
          <div className="portal-top-contact-col">
            <div className="contact-line-item">
              <span className="country-code-tag">IN</span>
              <span>+91 90145 32499 <span className="ext-badge" style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>Ext: 102</span></span>
            </div>
            <div className="contact-line-item">
              <span className="flag-circle">💬</span>
              <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp: +91 90145 32499</a>
            </div>
            <div className="contact-line-item">
              <Mail size={12} className="mail-icon-blue" />
              <span>info@irataxsolutions.com</span>
            </div>
          </div>

          {/* User Account Dropdown */}
          <div className="portal-user-corner" ref={userMenuRef}>
            <button
              type="button"
              className="portal-user-pill-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User size={15} className="user-icon-green" />
              <span className="user-greeting">Hi, {userName}</span>
              <ChevronDown size={12} className="chevron-icon" />
            </button>

            {userMenuOpen && (
              <div className="portal-user-dropdown">
                <div className="dropdown-user-header">
                  <strong>{user?.name || 'Taxpayer'}</strong>
                  <span>{user?.email || 'Registered Filer'}</span>
                </div>
                <hr />
                <Link to="/" onClick={() => setUserMenuOpen(false)}>
                  Public Home
                </Link>
                <Link to="/security" onClick={() => setUserMenuOpen(false)}>
                  Security &amp; Privacy
                </Link>
                <button onClick={handleLogout} className="dropdown-logout-btn">
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Vibrant Lime-Green Control Bar */}
      <div className="portal-green-control-bar">
        <div className="green-bar-inner">
          <div className="green-bar-left">
            <span className="file-id-badge">
              File No: <strong>{fileNumber}</strong>
            </span>
            <div className="status-pill-coral">
              Status : <span>{status}</span>
            </div>
          </div>

          <div className="green-bar-center">
            <Link to="/contact" className="btn-refer-gold">
              Book Free 15-Min Consultation
            </Link>
            <Link to="/about" className="btn-resources-cyan">
              Resources &amp; Form 1040 Guides
            </Link>
          </div>

          <div className="green-bar-right">
            <span className="direct-no-text">
              Direct Helpline : <span className="red-bold-num">+91 90145 32499</span> <span className="ext-badge">Ext: 102</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Announcement Ticker */}
      <div className="portal-ticker-bar">
        <div className="ticker-text-wrapper">
          <span className="ticker-label">TAX SEASON 2025:</span>
          <span className="ticker-item">
            🇺🇸 Form 1040, W-2, 1099, Multi-State Returns &amp; FBAR e-filing for Tax Year 2024 is now open!
          </span>
          <span className="ticker-item">
            🔒 Strict IRS Section 7216 Data Confidentiality &amp; 256-bit Bank-Level Encryption for all client files
          </span>
          <span className="ticker-item">
            ⚡ Every return prepared by a dedicated specialist and verified by a separate senior reviewer
          </span>
        </div>
      </div>

      {/* 4. Portal Main Body (Sidebar + Content Workspace) */}
      <div className="portal-workspace-body">
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`portal-sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Left Dark Sidebar */}
        <aside className={`portal-dark-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="portal-vertical-nav">
            <NavLink 
              to="/portal" 
              end
              className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="menu-icon" size={17} />
              <span>Home</span>
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
                <span className="toggle-symbol">{personalInfoOpen ? '▲' : '▼'}</span>
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
              <span>Schedule for Tax Notes</span>
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
