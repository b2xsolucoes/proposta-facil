
import { useState } from 'react';
import Layout from '@/components/Layout';
import ClientCard from '@/components/ClientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, FileText, User, Filter } from 'lucide-react';

// Mock data for clients
const mockClients = [
  { id: '1', name: 'Empresa ABC Ltda', email: 'contato@empresaabc.com.br', phone: '(11) 98765-4321', proposalsCount: 5 },
  { id: '2', name: 'Studio Design', email: 'contato@studiodesign.com', phone: '(11) 91234-5678', proposalsCount: 3 },
  { id: '3', name: 'Tech Solutions', email: 'contato@techsolutions.com.br', phone: '(21) 98765-4321', proposalsCount: 7 },
  { id: '4', name: 'Café Gourmet', email: 'contato@cafegourmet.com.br', phone: '(11) 97654-3210', proposalsCount: 2 },
  { id: '5', name: 'Livraria Cultura', email: 'contato@livrariacultuta.com.br', phone: '(11) 98877-6655', proposalsCount: 1 },
  { id: '6', name: 'Mercado Express', email: 'contato@mercadoexpress.com.br', phone: '(21) 96543-2109', proposalsCount: 4 },
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  
  const filteredClients = mockClients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) || 
      client.email.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus clientes e prospects
            </p>
          </div>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Nome da empresa ou cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={() => setIsAddClientOpen(false)}>
                    Salvar Cliente
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="prospects">Prospects</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-12 text-center">
            <User className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não encontramos clientes que correspondam à sua busca.
            </p>
            <Button onClick={() => setIsAddClientOpen(true)}>
              <Plus className="size-4 mr-2" />
              Adicionar Cliente
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                id={client.id}
                name={client.name}
                email={client.email}
                phone={client.phone}
                proposalsCount={client.proposalsCount}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
