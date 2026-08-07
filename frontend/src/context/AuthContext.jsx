import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// ─── Helper: sync axios Authorization header ───────────────────────────────
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// ─── Helper: safely parse user from localStorage ──────────────────────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Start with stored user so UI doesn't flash logged-out state
  const [user, setUser] = useState(getStoredUser);
  // CRITICAL: always start as true so guards wait for verification
  const [loading, setLoading] = useState(true);

  // Track whether we've set up the interceptor to avoid duplicates
  const interceptorRef = useRef(null);

  // ─── On mount: verify token with server ─────────────────────────────────
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // No token — definitely not logged in
        setUser(null);
        localStorage.removeItem('user');
        setAuthHeader(null);
        setLoading(false);
        return;
      }

      // Set header before making the request
      setAuthHeader(token);

      try {
        const res = await axios.get('/api/auth/me');
        const userData = res.data.user;

        // Server confirmed user is valid — update state & storage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Token invalid or expired — clear everything
        console.warn('Session check failed:', error.response?.data?.message || error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthHeader(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // ─── Axios interceptor: auto-logout on 401 ──────────────────────────────
  useEffect(() => {
    interceptorRef.current = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid mid-session
          const token = localStorage.getItem('token');
          if (token) {
            // Only auto-logout if we had a token (avoid loop on /login page)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthHeader(null);
            setUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.response.eject(interceptorRef.current);
      }
    };
  }, []);

  // ─── login: POST credentials, store token + user, update state ──────────
  const login = useCallback(async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user: userData } = res.data;

    if (!token || !userData) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthHeader(token);
    setUser(userData);

    // Return userData so the caller (Login.jsx) can check role for redirect
    return userData;
  }, []);

  // ─── register: POST new account ─────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    return res.data;
  }, []);

  // ─── logout: clear all auth state ───────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthHeader(null);
    setUser(null);
  }, []);

  // ─── updateUser: update stored user data without re-login ───────────────
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, isAdmin, isUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
