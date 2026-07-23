'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

export interface User {
  _id: string;
  email: string;
  username: string;
  role: 'reader' | 'creator' | 'admin';
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  interests?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  becomeCreator: () => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .me()
        .then((res) => setUser(res.user))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.token);
      setUser(res.user);
    } catch (err: any) {
      const msg = err.statusText || err.message || 'Login failed';
      setError(msg);
      throw err;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setError(null);
    try {
      const res = await authAPI.signup({ email, password, username });
      localStorage.setItem('token', res.token);
      setUser(res.user);
    } catch (err: any) {
      const msg = err.statusText || err.message || 'Signup failed';
      setError(msg);
      throw err;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  const becomeCreator = async () => {
    setError(null);
    try {
      const res = await authAPI.becomeCreator();
      setUser(res.user);
    } catch (err: any) {
      const msg = err.statusText || err.message || 'Failed to become creator';
      setError(msg);
      throw err;
    }
  };

  const refetchUser = async () => {
    try {
      const res = await authAPI.me();
      setUser(res.user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, becomeCreator, logout, refetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
