
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  useSignIn,
  useSignUp,
  useSignOut,
  useResetPassword,
  checkUserRole
} from './operations';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useSignOut();
  const { resetPassword } = useResetPassword();

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkUserRole,
  };
};
