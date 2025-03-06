
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription for user changes
    const userSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        () => {
          fetchUsers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(userSubscription);
    };
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_approved: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Usuário aprovado com sucesso',
        description: 'O usuário agora pode acessar o sistema',
      });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_approved: true } : u
      ));
    } catch (error: any) {
      toast({
        title: 'Erro ao aprovar usuário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      // Delete from the users table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      // Delete the auth user as well (requires admin access)
      // This is handled by Supabase functions in production

      toast({
        title: 'Usuário excluído com sucesso',
        description: 'O usuário foi removido do sistema',
      });
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Administração</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Aprove novos usuários ou gerencie usuários existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground my-8">
                Nenhum usuário encontrado
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nome</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Função</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => (
                      <tr key={userData.id} className="border-b hover:bg-secondary/50 transition-all-200">
                        <td className="py-3 px-4">{userData.name}</td>
                        <td className="py-3 px-4">{userData.email}</td>
                        <td className="py-3 px-4 capitalize">{userData.role}</td>
                        <td className="py-3 px-4">
                          {userData.is_approved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aprovado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!userData.is_approved && userData.id !== user?.id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleApproveUser(userData.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="size-4 mr-1" />
                              Aprovar
                            </Button>
                          )}
                          
                          {userData.id !== user?.id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(userData.id)}
                              className="text-red-600"
                            >
                              <XCircle className="size-4 mr-1" />
                              Excluir
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
