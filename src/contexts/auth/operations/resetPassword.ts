
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log(`Initiating password reset for email: ${email}`);
      
      // Call our edge function instead of using the client directly
      const response = await supabase.functions.invoke('reset-password', {
        body: { email },
      });
      
      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Erro ao enviar e-mail de redefinição');
      }
      
      console.log('Password reset response:', response.data);
      
      toast({
        title: 'E-mail enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
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

  return {
    loading,
    resetPassword
  };
};
