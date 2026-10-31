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
              <span className="country-flag-icon" role="img" aria-label="India">🇮🇳</span>
              <a href="tel:+919014532499">+91 90145 32499</a>
              <span className="ext-badge-pill">Ext: 102</span>
            </span>
            <span className="portal-top-item whatsapp-item whatsapp-highlight-pulse">
              <svg className="whatsapp-official-icon" viewBox="0 0 24 24" width="14" height="14" fill="#25D366" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.999-.047-.282-.09-.645-.214-1.11-.416-1.938-.838-3.21-2.793-3.308-2.923-.098-.13-1.002-1.332-1.002-2.54 0-1.208.631-1.802.855-2.047.224-.245.489-.306.652-.306.163 0 .326.002.469.009.151.008.354-.057.553.421.204.489.693 1.691.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.107.502.143.245.636 1.05 1.365 1.701.939.837 1.731 1.097 1.976 1.22.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.551-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.592-.083.997z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.436 5.178L2 22l4.981-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.174c-1.637 0-3.17-.468-4.472-1.28l-.321-.2-3.084.866.829-3.029-.211-.336C3.844 14.858 3.326 13.47 3.326 12c0-4.783 3.891-8.674 8.674-8.674 4.783 0 8.674 3.891 8.674 8.674 0 4.783-3.891 8.674-8.674 8.674z"/>
              </svg>
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
              <img src="/ira-logo.png" alt="IRA Tax Solutions Logo" className="header-company-logo" />
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
              <span className="refer-reward-badge">$20 Reward</span>
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
