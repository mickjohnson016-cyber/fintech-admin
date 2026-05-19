'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, AuthState, UserRole } from '../types/auth';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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

  const fetchAndSetUser = async (user: any) => {
    try {
      const { data: profile, error } = await supabase
        .from('admins')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      console.log('Session user:', user);
      console.log('Admin profile:', profile);
      console.log('Profile error:', error);

      if (error) {
        console.error(error);
        setState({ user: null, isAuthenticated: false, isLoading: false });
        router.replace('/login');
        return;
      }

      if (!profile) {
        await supabase.auth.signOut();
        setState({ user: null, isAuthenticated: false, isLoading: false });
        router.replace('/login');
        return;
      }

      if (profile.status === 'Suspended' || !profile.is_active) {
        toast.error('Access Suspended', {
          description: 'This administrator account has been suspended.'
        });
        await supabase.auth.signOut();
        setState({ user: null, isAuthenticated: false, isLoading: false });
        router.replace('/login');
        return;
      }

      const adminUser: AdminUser = {
        id: user.id,
        name: profile.full_name || user.email?.split('@')[0] || 'Admin',
        email: profile.email || user.email,
        role: (profile.role || 'Support Admin') as UserRole,
        status: profile.status === 'Suspended' ? 'Disabled' : 'Active',
        avatar: profile.avatar_url || profile.avatar || null
      };

      setState({
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.error(err);
      setState({ user: null, isAuthenticated: false, isLoading: false });
      router.replace('/login');
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error(error);
          if (mounted) {
            setState({ user: null, isAuthenticated: false, isLoading: false });
            router.replace('/login');
          }
          return;
        }

        if (!session?.user) {
          if (mounted) {
            setState({ user: null, isAuthenticated: false, isLoading: false });
            router.replace('/login');
          }
          return;
        }

        if (mounted) {
          await fetchAndSetUser(session.user);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setState({ user: null, isAuthenticated: false, isLoading: false });
          router.replace('/login');
        }
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (!session) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        router.replace('/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchAndSetUser(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid email or password. Please verify your credentials.');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Authentication failed: No user data returned.');
      }

      await fetchAndSetUser(data.user);
      
      toast.success('Signed In successfully');
      router.replace('/dashboard');
    } catch (error: any) {
      toast.error('Authentication Failed', {
        description: error.message || 'Invalid email or password.'
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Signup failed: No user data returned.');
      }

      try {
        const { data: existingInvited } = await supabase
          .from('admins')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (existingInvited) {
          await supabase
            .from('admins')
            .update({
              auth_user_id: data.user.id,
              status: 'Active',
              is_active: true
            })
            .eq('id', existingInvited.id);
        } else {
          await supabase
            .from('admins')
            .upsert({
              auth_user_id: data.user.id,
              email: email,
              full_name: email.split('@')[0],
              role: 'staff',
              status: 'Active',
              is_active: true
            });
        }
      } catch (profileErr) {
        console.error('Profile creation exception:', profileErr);
      }

      toast.success('Registration Successful', {
        description: 'Your administrator account has been created.'
      });

      const session = await supabase.auth.getSession();
      if (session.data.session) {
        router.replace('/dashboard');
      } else {
        toast.info('Verification Required', {
          description: 'Please check your email to verify your registration, then sign in.'
        });
        router.replace('/login');
      }
    } catch (error: any) {
      toast.error('Signup Failed', {
        description: error.message || 'Could not register administrator account.'
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      localStorage.removeItem('oinz_access_keys');

      router.replace('/login');
      router.refresh();

      toast.success('Signed Out', {
        description: 'Your administrator session has ended.'
      });
    } catch (error: any) {
      toast.error('Error signing out', {
        description: error.message
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
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
