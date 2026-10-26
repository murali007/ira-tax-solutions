import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ira_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from database on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ira_token');
      if (savedToken) {
        try {
          const data = await api.auth.getMe(savedToken);
          if (data && data.user) {
            setUser(data.user);
            setToken(savedToken);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('ira_token');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch {
          // Fallback if backend offline
          const fallbackUser = localStorage.getItem('ira_user_backup');
          if (fallbackUser) {
            setUser(JSON.parse(fallbackUser));
            setIsAuthenticated(true);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('ira_token', data.token);
      localStorage.setItem('ira_user_backup', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed.' };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const data = await api.auth.register(name, email, password, phone);
      localStorage.setItem('ira_token', data.token);
      localStorage.setItem('ira_user_backup', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ira_token');
    localStorage.removeItem('ira_user_backup');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
