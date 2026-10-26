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
  ShieldCheck, 
  FileSignature, 
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
      {/* 1. Portal Brand & Contact Row (Clip 5/6 top) */}
      <div className="portal-brand-row">
        <div className="portal-brand-inner">
          {/* Logo */}
          <Link to="/" className="portal-top-logo">
            <CheckSquare size={26} className="logo-check-green" />
            <div className="logo-text-group">
              <span className="logo-part-dark">IRA</span>
              <span className="logo-part-green">Tax</span>
              <span className="logo-part-dark">Solutions</span>
            </div>
          </Link>

          {/* Center Referral Callout */}
          <Link to="/refer" className="portal-center-referral">
            <Users size={22} className="refer-users-icon" />
            <div className="refer-text-col">
              <span className="refer-title">REFER A FRIEND</span>
              <span className="refer-sub">&amp; Make Some Extra Income</span>
            </div>
          </Link>

          {/* Contact Direct Numbers */}
          <div className="portal-top-contact-col">
            <div className="contact-line-item">
              <span className="flag-circle">🇮🇳</span>
              <span>+91 91211 57586</span>
            </div>
            <div className="contact-line-item">
              <span className="flag-circle">🇮🇳</span>
              <span>+91 72070 57471</span>
            </div>
            <div className="contact-line-item">
              <Mail size={12} className="mail-icon-blue" />
              <span>contact@irataxsolutions.com</span>
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
                <button onClick={handleLogout} className="dropdown-logout-btn">
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Vibrant Lime-Green Control Bar matching Clip 5/6 */}
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
            <Link to="/refer" className="btn-refer-gold">
              Refer a Friend &amp; Earn ₹500
            </Link>
            <Link to="/about" className="btn-resources-cyan">
              Resources &amp; ITR Guides
            </Link>
          </div>

          <div className="green-bar-right">
            <span className="direct-no-text">
              Direct Helpline : <span className="red-bold-num">+91 91211 57586</span> <span className="ext-badge">Ext: 102</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Announcement Ticker matching Clip 5/6 */}
      <div className="portal-ticker-bar">
        <div className="ticker-text-wrapper">
          <span className="ticker-label">REFERRAL REWARDS:</span>
          <span className="ticker-item">
            Refer your friends, colleagues &amp; family to file ITR and earn ₹500 per successful filing via direct UPI!
          </span>
          <span className="ticker-item">
            🏛️ ITR e-Filing &amp; Advance Tax for AY 2025-26 (FY 2024-25) is now live under New &amp; Old Tax Regimes
          </span>
          <span className="ticker-item">
            ⚡ Quick E-Verification with Aadhaar OTP &amp; Instant ITR-V generation
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

        {/* Left Dark Sidebar matching Clip 5 - 10 */}
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

            {/* Collapsible Personal Information */}
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
              </button>

              {personalInfoOpen && (
                <div className="sub-menu-tree">
                  <NavLink 
                    to="/portal/taxpayer" 
                    className={({ isActive }) => `sub-link-item ${isActive ? 'sub-active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    » Taxpayer
                  </NavLink>
                  <NavLink 
                    to="/portal/spouse" 
                    className={({ isActive }) => `sub-link-item ${isActive ? 'sub-active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    » Spouse, If Married
                  </NavLink>
                  <NavLink 
                    to="/portal/dependents" 
                    className={({ isActive }) => `sub-link-item ${isActive ? 'sub-active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    » Dependents
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
              <span>Address of Living in Tax Year</span>
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

            <NavLink 
              to="/portal/refund-policy" 
              className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldCheck className="menu-icon" size={17} />
              <span>100% Fee Refund Policy</span>
            </NavLink>

            <NavLink 
              to="/portal/service-agreement" 
              className={({ isActive }) => `menu-link-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileSignature className="menu-icon" size={17} />
              <span>Service Agreement</span>
            </NavLink>
          </nav>
        </aside>

        {/* Mobile Toggle Button */}
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
