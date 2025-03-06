import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkUserRole(session.user.id);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is admin
  const checkUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role, is_approved')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return;
    }

    if (data) {
      setIsAdmin(data.role === 'admin');
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is approved
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_approved, role')
        .eq('id', data.user?.id)
        .single();

      if (userError) throw userError;

      if (!userData.is_approved) {
        await supabase.auth.signOut();
        throw new Error('Sua conta está aguardando aprovação por um administrador.');
      }

      setIsAdmin(userData.role === 'admin');
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao PropostaApp!',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Check if there are users already
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Create user profile in the users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user?.id,
        email: data.user?.email,
        name,
        role: count === 0 ? 'admin' : 'user',
        is_approved: count === 0 ? true : false, // First user is auto-approved and admin
      });

      if (profileError) throw profileError;

      toast({
        title: 'Cadastro realizado com sucesso',
        description: count === 0 
          ? 'Você é o primeiro usuário e foi definido como administrador.'
          : 'Sua conta está aguardando aprovação por um administrador.',
      });

      if (count === 0) {
        // If this is the first user, they are auto-approved as admin
        navigate('/dashboard');
      } else {
        // Otherwise, sign them out to await approval
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Volte logo!',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
