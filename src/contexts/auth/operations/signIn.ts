
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return {
    loading,
    signIn
  };
};
