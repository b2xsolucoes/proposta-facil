
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin
  const checkUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role, is_approved')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return { isAdmin: false };
    }

    if (data) {
      return { 
        isAdmin: data.role === 'admin',
        isApproved: data.is_approved
      };
    }
    
    return { isAdmin: false };
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      // Get the current user's email
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email || '';
      
      if (!email) {
        throw new Error('Usuário não encontrado');
      }
      
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Senha atual incorreta');
      
      // If sign in successful, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Senha atualizada com sucesso',
        description: 'Sua senha foi alterada com sucesso',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Special case for master user
      const isMasterUser = email === 'b2x';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isMasterUser ? 'master@b2x.com' : email,
        password: isMasterUser ? '12345678' : password,
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

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao PropostaApp!',
      });
      navigate('/dashboard');
      
      return { isAdmin: userData.role === 'admin' };
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais',
        variant: 'destructive',
      });
      return { isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Special case for master user creation
      const isMasterUser = email === 'b2x';
      const actualEmail = isMasterUser ? 'master@b2x.com' : email;
      const actualPassword = isMasterUser ? '12345678' : password;
      
      const { data, error } = await supabase.auth.signUp({
        email: actualEmail,
        password: actualPassword,
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
        role: count === 0 || isMasterUser ? 'admin' : 'user',
        is_approved: count === 0 || isMasterUser ? true : false, // First user and master user are auto-approved and admin
      });

      if (profileError) throw profileError;

      toast({
        title: 'Cadastro realizado com sucesso',
        description: (count === 0 || isMasterUser) 
          ? 'Você é o primeiro usuário e foi definido como administrador.'
          : 'Sua conta está aguardando aprovação por um administrador.',
      });

      if (count === 0 || isMasterUser) {
        // If this is the first user or master user, they are auto-approved as admin
        navigate('/dashboard');
      } else {
        // Otherwise, sign them out to await approval
        await supabase.auth.signOut();
        navigate('/login');
      }
      
      return { isAdmin: count === 0 || isMasterUser };
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
      return { isAdmin: false };
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

  return {
    loading,
    signIn,
    signUp,
    signOut,
    checkUserRole,
    changePassword,
  };
};
