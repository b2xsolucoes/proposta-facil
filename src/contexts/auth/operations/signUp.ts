
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

      // First check if the email already exists in auth.users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: 'Erro ao criar conta',
          description: 'Este email já está cadastrado. Por favor, use outro email ou faça login.',
          variant: 'destructive',
        });
        return { isAdmin: false };
      }

      // If email doesn't exist, proceed with signup
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

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: name,
        role: count === 0 ? 'admin' : 'user',
        is_approved: count === 0 ? true : false,
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        if (profileError.code === '23505') { // unique_violation
          // Profile already exists, try to update it
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
        } else {
          throw profileError;
        }
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
      
      if (error.message?.includes('Email')) {
        errorMessage = 'Email inválido ou já cadastrado';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
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
