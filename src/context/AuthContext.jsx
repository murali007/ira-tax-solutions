import { createContext, useContext, useState, useEffect } from 'react';

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
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Login failed.' };
      }

      localStorage.setItem('ira_token', data.token);
      localStorage.setItem('ira_user_backup', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not connect to database server. Please ensure the backend is running.' };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Registration failed.' };
      }

      localStorage.setItem('ira_token', data.token);
      localStorage.setItem('ira_user_backup', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not connect to database server. Please ensure the backend is running.' };
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
