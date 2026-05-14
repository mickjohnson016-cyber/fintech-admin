
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminUser, AuthState } from '../types/auth';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (name: string, key: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  // Session recovery
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await authService.getSession();
        if (user) {
          setState({ user, isAuthenticated: true, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
    initAuth();
  }, []);

  const login = async (name: string, key: string) => {
    try {
      const user = await authService.login(name, key);
      setState({ user, isAuthenticated: true, isLoading: false });
      toast.success(`Welcome back, ${user.name}`, {
        description: `Authorized as ${user.role}`
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Authentication Failed', {
        description: error.message || 'Invalid access key or authorization error.'
      });
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
