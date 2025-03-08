
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
      console.error('Login error details:', error);
      return { isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      console.log("Starting signup process for:", email, "with name:", name);
      
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("Falha ao criar usuário. Nenhum usuário foi retornado pela API.");
      }

      console.log("Auth user created successfully:", data.user.id);

      // Check if there are users already
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error("Error counting users:", countError);
        throw countError;
      }

      console.log("Current user count:", count);

      // Explicitly create user profile instead of relying on the trigger
      try {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: count === 0 ? 'admin' : 'user',
          is_approved: count === 0 ? true : false, // First user is auto-approved and admin
        });
        
        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // If there's an error, we'll try to update instead
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              email: data.user.email,
              name: name,
              role: count === 0 ? 'admin' : 'user',
              is_approved: count === 0 ? true : false
            })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating user profile:", updateError);
            throw updateError;
          }
        }
      } catch (profileError: any) {
        console.error("Profile creation/update error:", profileError);
        // We will not throw here to allow the process to continue
        // The trigger might have created the profile already
      }

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
      
      return { isAdmin: count === 0 };
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
      console.error('Signup error details:', error);
      return { isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  // Reset password (for existing email)
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: 'E-mail enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
      return false;
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
    resetPassword,
    checkUserRole,
  };
};
