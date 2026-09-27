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
    let isMounted = true;
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .me()
        .then((res) => {
          if (isMounted && res?.user) {
            setUser(res.user);
          }
        })
        .catch((err: unknown) => {
          const msg = (err instanceof Error ? err.message : String(err || '')).toLowerCase();
          // Only wipe token if token is definitively invalid
          if (msg.includes('token') || msg.includes('unauthorized') || msg.includes('jwt') || msg.includes('forbidden')) {
            localStorage.removeItem('token');
            if (isMounted) setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      queueMicrotask(() => {
        if (isMounted) setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.token);
      setUser(res.user);
    } catch (err: unknown) {
      const errObj = err as { statusText?: string; message?: string } | null;
      const msg = errObj?.statusText || errObj?.message || 'Login failed';
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
    } catch (err: unknown) {
      const errObj = err as { statusText?: string; message?: string } | null;
      const msg = errObj?.statusText || errObj?.message || 'Signup failed';
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
    } catch (err: unknown) {
      const errObj = err as { statusText?: string; message?: string } | null;
      const msg = errObj?.statusText || errObj?.message || 'Failed to become creator';
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
