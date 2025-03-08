
import { supabase } from '@/lib/supabase';

export const checkUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('role, is_approved')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return { isAdmin: false };
  }

  if (data) {
    return { 
      isAdmin: data.role === 'admin',
      isApproved: data.is_approved
    };
  }
  
  return { isAdmin: false };
};
