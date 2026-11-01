import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@irataxsolutions.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'IRA Tax Solutions — Admin & Preparer Portal';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-head">
          <div className="admin-brand-icon">
            <ShieldCheck size={32} />
          </div>
          <h1>IRA Tax Solutions</h1>
          <h2>Administrative Review &amp; Intake Desk</h2>
          <p>Authorized Tax Preparers, Reviewers &amp; Audit Officers Only</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field-group">
            <label>Admin Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@irataxsolutions.com"
              required
            />
          </div>

          <div className="admin-field-group">
            <label>Master Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="admin-credentials-hint">
            <ShieldCheck size={14} />
            <span>Default Staff Login: <code>admin@irataxsolutions.com</code> / <code>admin123</code></span>
          </div>

          <button type="submit" className="btn-admin-signin" disabled={loading}>
            <Lock size={15} />
            <span>{loading ? 'Authenticating Officer...' : 'Authenticate & Enter Review Desk'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="admin-login-foot">
          <span>Protected under IRS Section 7216 &amp; FTC Safeguards Rule</span>
        </div>
      </div>
    </div>
  );
}
