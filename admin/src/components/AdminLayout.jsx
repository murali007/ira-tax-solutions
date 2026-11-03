import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  Home,
  Users, 
  Calendar, 
  FileText, 
  Folder, 
  MessageSquare, 
  Receipt, 
  Tag, 
  Megaphone, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  LogOut, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [taxYear, setTaxYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'IRA Tax Solutions — Tax Operations Workspace';
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clients?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/clients');
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-workspace-layout">
      {/* ========================================================
          TOP GLOBAL HEADER BAR
          ======================================================== */}
      <header className="admin-top-header">
        <div className="top-header-left">
          <button 
            type="button" 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="admin-brand-link">
            <span className="brand-logo-pill">IRA</span>
            <span className="brand-title-text">IRATaxSolutions</span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="top-search-form">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search clients by name, email, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Top Header Controls (Tax Year & Profile) */}
        <div className="top-header-right">
          <div className="tax-year-selector">
            <Calendar size={14} style={{ color: '#0284c7' }} />
            <select 
              value={taxYear} 
              onChange={(e) => setTaxYear(e.target.value)}
              className="tax-year-dropdown"
            >
              <option value="2025">Tax year 2025</option>
              <option value="2024">Tax year 2024</option>
              <option value="2023">Tax year 2023</option>
            </select>
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="admin-profile-wrapper">
            <button 
              type="button" 
              className="admin-profile-button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="profile-bubble">AD</div>
              <span className="profile-title">Admin</span>
              <ChevronDown size={14} className="profile-chevron" />
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-info">
                  <strong>{adminUser?.name || 'IRA Tax Administrator'}</strong>
                  <span>{adminUser?.email || 'admin@irataxsolutions.com'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="dropdown-logout-btn"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          LAYOUT BODY: SIDEBAR + MAIN CONTENT VIEWPORT
          ======================================================== */}
      <div className="admin-layout-body">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="mobile-sidebar-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}

        {/* Left Navigation Sidebar */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-scroll-wrap">
            {/* 1. OPERATIONS */}
            <div className="sidebar-group">
              <span className="sidebar-group-title">OPERATIONS</span>
              <nav className="sidebar-nav">
                <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
                  <Home size={17} />
                  <span>Dashboard</span>
                </Link>

                <Link to="/clients" className={`sidebar-link ${isActive('/clients') ? 'active' : ''}`}>
                  <Users size={17} />
                  <span>Clients</span>
                </Link>

                <Link to="/consultations" className={`sidebar-link ${isActive('/consultations') ? 'active' : ''}`}>
                  <Calendar size={17} />
                  <span>Consultations</span>
                </Link>

                <Link to="/returns" className={`sidebar-link ${isActive('/returns') ? 'active' : ''}`}>
                  <FileText size={17} />
                  <span>Tax Returns</span>
                </Link>

                <Link to="/documents" className={`sidebar-link ${isActive('/documents') ? 'active' : ''}`}>
                  <Folder size={17} />
                  <span>Documents</span>
                </Link>

                <Link to="/team" className={`sidebar-link ${isActive('/team') ? 'active' : ''}`}>
                  <Users size={17} />
                  <span>Team &amp; Review</span>
                </Link>

                <Link to="/messages" className={`sidebar-link ${isActive('/messages') ? 'active' : ''}`}>
                  <MessageSquare size={17} />
                  <span>Messages</span>
                  <span className="sidebar-badge-pill">3</span>
                </Link>

                <Link to="/invoices" className={`sidebar-link ${isActive('/invoices') ? 'active' : ''}`}>
                  <Receipt size={17} />
                  <span>Invoices</span>
                </Link>
              </nav>
            </div>

            {/* 2. WEBSITE */}
            <div className="sidebar-group">
              <span className="sidebar-group-title">WEBSITE</span>
              <nav className="sidebar-nav">
                <Link to="/services" className={`sidebar-link ${isActive('/services') ? 'active' : ''}`}>
                  <FileText size={17} />
                  <span>Pages &amp; Services</span>
                </Link>

                <Link to="/pricing" className={`sidebar-link ${isActive('/pricing') ? 'active' : ''}`}>
                  <Tag size={17} />
                  <span>Pricing &amp; Offers</span>
                </Link>

                <Link to="/referrals" className={`sidebar-link ${isActive('/referrals') ? 'active' : ''}`}>
                  <Megaphone size={17} />
                  <span>Referrals</span>
                </Link>
              </nav>
            </div>

            {/* 3. ADMIN */}
            <div className="sidebar-group">
              <span className="sidebar-group-title">ADMIN</span>
              <nav className="sidebar-nav">
                <Link to="/reports" className={`sidebar-link ${isActive('/reports') ? 'active' : ''}`}>
                  <BarChart3 size={17} />
                  <span>Reports</span>
                </Link>

                <Link to="/audit" className={`sidebar-link ${isActive('/audit') ? 'active' : ''}`}>
                  <ShieldCheck size={17} />
                  <span>Access &amp; Audit</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Viewport Content */}
        <main className="admin-main-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
