import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MetricsCard from '@/components/MetricsCard';
import ProposalStats from '@/components/ProposalStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  User, 
  DollarSign, 
  CheckCircle,
  Calendar,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

const chartData = {
  weekly: [
    { name: 'Seg', enviadas: 4, aceitas: 2 },
    { name: 'Ter', enviadas: 3, aceitas: 1 },
    { name: 'Qua', enviadas: 5, aceitas: 3 },
    { name: 'Qui', enviadas: 2, aceitas: 2 },
    { name: 'Sex', enviadas: 6, aceitas: 4 },
    { name: 'Sáb', enviadas: 1, aceitas: 1 },
    { name: 'Dom', enviadas: 0, aceitas: 0 },
  ],
  monthly: [
    { name: 'Jan', enviadas: 20, aceitas: 12 },
    { name: 'Fev', enviadas: 25, aceitas: 15 },
    { name: 'Mar', enviadas: 30, aceitas: 20 },
    { name: 'Abr', enviadas: 22, aceitas: 14 },
    { name: 'Mai', enviadas: 28, aceitas: 18 },
    { name: 'Jun', enviadas: 35, aceitas: 25 },
  ],
};

interface Proposal {
  id: string;
  client_id: string;
  title: string;
  status: string;
  total_value: number;
  created_at: string;
  client_name?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const { data: proposalsData, error: proposalsError } = await supabase
          .from('proposals')
          .select('id, client_id, title, status, total_value, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (proposalsError) throw proposalsError;
        
        if (!proposalsData || proposalsData.length === 0) {
          setRecentProposals([]);
          setLoading(false);
          return;
        }
        
        const clientIds = [...new Set(proposalsData.map(p => p.client_id))];
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name')
          .in('id', clientIds);
        
        if (clientsError) throw clientsError;
        
        const proposalsWithClientNames = proposalsData.map(proposal => {
          const client = clientsData?.find(c => c.id === proposal.client_id);
          return {
            ...proposal,
            client_name: client?.name || 'Cliente desconhecido'
          };
        });
        
        setRecentProposals(proposalsWithClientNames);
      } catch (error: any) {
        console.error('Error fetching proposals:', error);
        toast({
          title: "Erro ao carregar propostas",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, [user, toast]);
  
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      aceita: "bg-green-100 text-green-800",
      pendente: "bg-yellow-100 text-yellow-800",
      rejeitada: "bg-red-100 text-red-800",
      draft: "bg-blue-100 text-blue-800"
    };
    
    const displayStatus = status === 'draft' ? 'rascunho' : status;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pendente}`}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/create-proposal')}>
            <Plus className="size-4 mr-2" />
            Nova Proposta
          </Button>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard 
            title="Total de Propostas" 
            value="42" 
            icon={<FileText className="size-4" />}
            trend={{ value: 12, isPositive: true }}
            description="últimos 30 dias"
          />
          <MetricsCard 
            title="Taxa de Conversão" 
            value="68%" 
            icon={<CheckCircle className="size-4" />}
            trend={{ value: 5, isPositive: true }}
            description="últimos 30 dias"
          />
          <MetricsCard 
            title="Valor Médio" 
            value="R$ 4.350" 
            icon={<DollarSign className="size-4" />}
            trend={{ value: 2, isPositive: false }}
            description="últimos 30 dias"
          />
          <MetricsCard 
            title="Clientes Ativos" 
            value="18" 
            icon={<User className="size-4" />}
            trend={{ value: 3, isPositive: true }}
            description="últimos 30 dias"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProposalStats data={chartData} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Próximos Acompanhamentos</CardTitle>
              <CardDescription>Propostas pendentes de acompanhamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-all-200">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{`Studio Design ${i + 1}`}</h4>
                      <p className="text-sm text-muted-foreground">Proposta enviada em 02/06/2023</p>
                      <Button variant="link" className="px-0 py-1 h-auto">
                        <span className="flex items-center">
                          Ver detalhes
                          <ArrowUpRight className="size-3 ml-1" />
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Proposals */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Propostas Recentes</CardTitle>
              <CardDescription>Lista das últimas propostas enviadas</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/create-proposal')}>
              Nova Proposta
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : recentProposals.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma proposta encontrada</p>
                <Button 
                  variant="link" 
                  className="mt-2" 
                  onClick={() => navigate('/create-proposal')}
                >
                  Criar sua primeira proposta
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium">Data</th>
                      <th className="text-left py-3 px-4 font-medium">Valor</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProposals.map((proposal) => (
                      <tr key={proposal.id} className="border-b hover:bg-secondary/50 transition-all-200">
                        <td className="py-3 px-4">{proposal.client_name}</td>
                        <td className="py-3 px-4">{formatDate(proposal.created_at)}</td>
                        <td className="py-3 px-4">
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(proposal.total_value)}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(proposal.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/preview-proposal/${proposal.id}`)}
                          >
                            Ver
                          </Button>
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

export default Dashboard;
