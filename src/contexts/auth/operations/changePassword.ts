
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useChangePassword = (setLoading: (loading: boolean) => void) => {
  const { toast } = useToast();

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      // Get the current user's email
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.email) {
        throw new Error('Usuário não encontrado');
      }
      
      const email = userData.user.email;
      
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
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

  return changePassword;
};
