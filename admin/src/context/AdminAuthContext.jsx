import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ira_admin_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ira_admin_token');
      if (savedToken) {
        try {
          const data = await api.auth.getMe(savedToken);
          if (data && data.user && data.user.role === 'admin') {
            setAdminUser(data.user);
            setToken(savedToken);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('ira_admin_token');
            setAdminUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch {
          localStorage.removeItem('ira_admin_token');
          setAdminUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      if (data.user?.role !== 'admin') {
        return { success: false, message: 'Access Denied: This portal is strictly reserved for authorized tax administrators.' };
      }
      localStorage.setItem('ira_admin_token', data.token);
      setAdminUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ira_admin_token');
    setAdminUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    adminUser,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
