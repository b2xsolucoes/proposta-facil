import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSignUp = (setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return signUp;
};
