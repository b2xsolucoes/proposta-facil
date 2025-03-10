
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

      // Wait a moment to ensure the trigger has time to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if there are users already
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error("Error counting users:", countError);
        throw countError;
      }

      console.log("Current user count:", count);

      // Check if the user profile was created by the trigger
      const { data: profileData, error: profileCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileCheckError || !profileData) {
        console.log("User profile not found, attempting to create manually");
        
        // Explicitly create user profile
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
      } else {
        console.log("User profile created by trigger successfully:", profileData);
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

  return {
    loading,
    signUp
  };
};
