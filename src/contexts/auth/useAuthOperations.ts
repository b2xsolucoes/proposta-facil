
import { useState } from 'react';
import { 
  useSignIn,
  useSignUp,
  useSignOut,
  useChangePassword,
  useCheckUserRole
} from './operations';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  
  // Import all operations
  const signIn = useSignIn(setLoading);
  const signUp = useSignUp(setLoading);
  const signOut = useSignOut(setLoading);
  const changePassword = useChangePassword(setLoading);
  const checkUserRole = useCheckUserRole();

  return {
    loading,
    signIn,
    signUp,
    signOut,
    checkUserRole,
    changePassword,
  };
};
