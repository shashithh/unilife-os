import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'unilife_token';
const USER_KEY  = 'unilife_user';

// Set the auth header immediately on module load (before any component renders)
const savedToken = localStorage.getItem(TOKEN_KEY);
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);

  function _persist(userData, jwt) {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem(USER_KEY,  JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, jwt);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  }

  // login(email, password) — calls the backend
  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    _persist(data.user, data.token);
  };

  // signup(name, email, password, major, year) — calls the backend
  const signup = async (name, email, password, major, year) => {
    const { data } = await axios.post('/api/auth/signup', { name, email, password, major, year });
    _persist(data.user, data.token);

  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
