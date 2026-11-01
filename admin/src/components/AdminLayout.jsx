import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  ShieldCheck, 
  Users, 
  LogOut, 
  ChevronRight, 
  Layers
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'IRA Tax Solutions — Admin & Preparer Portal';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDetail = location.pathname.includes('/clients/');

  return (
    <div className="admin-app-root">
      {/* Admin Top Navigation Bar */}
      <header className="admin-header-bar">
        <div className="admin-header-inner">
          <div className="admin-brand-section">
            <Link to="/" className="admin-brand-logo">
              <span className="admin-logo-mark">IRA</span>
              <div className="admin-brand-titles">
                <span className="admin-brand-name">IRA Tax Solutions</span>
                <span className="admin-portal-badge">Admin Review &amp; Document Validation Desk</span>
              </div>
            </Link>
          </div>

          <div className="admin-nav-links">
            <Link 
              to="/" 
              className={`admin-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Users size={16} />
              <span>Taxpayer Filings Queue</span>
            </Link>
          </div>

          <div className="admin-user-section">
            <div className="admin-profile-pill">
              <div className="admin-avatar-bubble">
                <ShieldCheck size={16} />
              </div>
              <div className="admin-profile-meta">
                <span className="admin-user-name">{adminUser?.name || 'Tax Administrator'}</span>
                <span className="admin-user-role">IRS Authorized Reviewer</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleLogout} 
              className="admin-logout-btn" 
              title="Sign Out of Admin Desk"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Subheader Breadcrumbs Bar */}
      <div className="admin-subnav-strip">
        <div className="admin-subnav-inner">
          <div className="admin-breadcrumb-path">
            <Link to="/" className="crumb-link">
              <Layers size={14} />
              <span>Admin Desk</span>
            </Link>
            <ChevronRight size={13} className="crumb-sep" />
            {isDetail ? (
              <span className="crumb-active">Client Dossier &amp; Document Review</span>
            ) : (
              <span className="crumb-active">Active Taxpayer Filings Queue</span>
            )}
          </div>
          <div className="admin-security-pill">
            <ShieldCheck size={14} />
            <span>IRS Sec. 7216 Verified Administrative Session</span>
          </div>
        </div>
      </div>

      {/* Admin Main Body */}
      <main className="admin-main-container">
        <Outlet />
      </main>
    </div>
  );
}
