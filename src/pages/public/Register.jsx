import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';
import './Login.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    referName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/portal" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Mobile Number is mandatory. Please provide a valid phone number.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(
      formData.name.trim(), 
      formData.email.trim(), 
      formData.password, 
      formData.phone.trim(), 
      formData.referName.trim()
    );
    setLoading(false);

    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">IRA</div>
          <h2>Create US Tax Filing Account</h2>
          <p>Get your official File ID and begin your Form 1040 preparation workflow</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Legal Name *</label>
            <input
              id="reg-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full legal name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Mobile Number *</label>
            <input
              id="reg-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (386) 392-8693 or +91 90145 32499"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-refer-name">
              Refer Name <span className="field-optional-tag">(Optional)</span>
            </label>
            <input
              id="reg-refer-name"
              type="text"
              value={formData.referName}
              onChange={(e) => setFormData({ ...formData, referName: e.target.value })}
              placeholder="Name of friend or colleague who referred you"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-pw">Password *</label>
              <input
                id="reg-pw"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-cpw">Confirm *</label>
              <input
                id="reg-cpw"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating Account...' : 'Register & Start Filing'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an active account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
