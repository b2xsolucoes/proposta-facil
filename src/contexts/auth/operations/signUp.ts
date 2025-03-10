
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      console.log("Starting signup process for:", email);

      // Sign up the user first
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

      // Attempt to create the user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: count === 0 ? 'admin' : 'user',
          is_approved: count === 0 ? true : false,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error("Error creating/updating user profile:", profileError);
        throw profileError;
      }

      toast({
        title: 'Cadastro realizado com sucesso',
        description: count === 0 
          ? 'Você é o primeiro usuário e foi definido como administrador.'
          : 'Sua conta está aguardando aprovação por um administrador.',
      });

      if (count === 0) {
        navigate('/dashboard');
      } else {
        await supabase.auth.signOut();
        navigate('/login');
      }
      
      return { isAdmin: count === 0 };
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      let errorMessage = 'Tente novamente mais tarde';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Por favor, use outro email ou faça login.';
      } else if (error.message?.includes('Email')) {
        errorMessage = 'Email inválido ou já cadastrado';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.code === '23505') {
        errorMessage = 'Este email já está cadastrado. Por favor, use outro email ou faça login.';
      }
      
      toast({
        title: 'Erro ao criar conta',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp
  };
};
