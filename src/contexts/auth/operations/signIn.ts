
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSignIn = (setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      
      // If it's the master user, only allow access to dashboard
      if (isMasterUser) {
        navigate('/dashboard');
      } else {
        // For normal users, navigate to the dashboard as usual
        navigate('/dashboard');
      }
      
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

  return signIn;
};
