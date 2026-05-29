'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: 'citizen' | 'authority';
    phone?: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Validate token on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('roadwatch_token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }
        setToken(storedToken);
        const { user: currentUser } = await authAPI.me();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('roadwatch_token');
        localStorage.removeItem('roadwatch_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const { token: newToken, user: newUser } = await authAPI.login(
      email,
      password
    );
    localStorage.setItem('roadwatch_token', newToken);
    localStorage.setItem('roadwatch_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      role: 'citizen' | 'authority';
      phone?: string;
    }): Promise<User> => {
      const { token: newToken, user: newUser } =
        await authAPI.register(payload);
      localStorage.setItem('roadwatch_token', newToken);
      localStorage.setItem('roadwatch_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    },
    []
  );

  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('roadwatch_token');
    localStorage.removeItem('roadwatch_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
