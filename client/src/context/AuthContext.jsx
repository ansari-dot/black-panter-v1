import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await authApi.me();
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, otp) => {
    const res = await authApi.login({ email, password, otp });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email) => {
    const res = await authApi.register({ name, email, role: 'user' });
    return res;
  };

  const setupAccount = async (email, token, password) => {
    const res = await authApi.setupAccount({ email, token, password });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, setupAccount, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
