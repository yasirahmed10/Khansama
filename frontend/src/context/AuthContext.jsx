import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('token'); // same JWT mechanism
      const role = localStorage.getItem('role');

      if (token) {
        try {
          if (role === 'admin') {
            // For simplicity, we can load admin info
            setAdmin({ email: localStorage.getItem('email') || 'admin@khansama.com' });
          } else {
            const { data } = await authApi.me();
            setUser(data);
          }
        } catch (err) {
          console.error('Auth initialization failed', err);
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('role', 'user');
    setUser(data.user);
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await authApi.adminLogin({ email, password });
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('role', 'admin');
    localStorage.setItem('email', data.admin.email);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAdmin(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, adminLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
