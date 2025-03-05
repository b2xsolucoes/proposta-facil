
import { useState } from 'react';
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

const recentProposals = [
  { id: '1', client: 'Empresa ABC', date: '05/06/2023', status: 'aceita', value: 5800 },
  { id: '2', client: 'Studio Design', date: '02/06/2023', status: 'pendente', value: 3200 },
  { id: '3', client: 'Tech Solutions', date: '28/05/2023', status: 'rejeitada', value: 7500 },
  { id: '4', client: 'Café Gourmet', date: '25/05/2023', status: 'aceita', value: 2800 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      aceita: "bg-green-100 text-green-800",
      pendente: "bg-yellow-100 text-yellow-800",
      rejeitada: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
                      <td className="py-3 px-4">{proposal.client}</td>
                      <td className="py-3 px-4">{proposal.date}</td>
                      <td className="py-3 px-4">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(proposal.value)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(proposal.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
