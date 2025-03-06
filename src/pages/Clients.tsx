
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Mail, Phone, Building2, User2, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Mock data for clients
const mockClients = [
  { 
    id: '1', 
    name: 'Empresa ABC', 
    contact: 'João Silva',
    email: 'contato@empresaabc.com', 
    phone: '(11) 9999-8888',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    notes: 'Cliente desde 2020'
  },
  { 
    id: '2', 
    name: 'Studio Design', 
    contact: 'Maria Oliveira',
    email: 'contato@studiodesign.com', 
    phone: '(11) 8888-7777',
    address: 'Rua Augusta, 500, São Paulo - SP',
    notes: 'Interessado em serviços de marketing digital'
  },
  { 
    id: '3', 
    name: 'Tech Solutions', 
    contact: 'Pedro Santos',
    email: 'contato@techsolutions.com', 
    phone: '(11) 7777-6666',
    address: 'Av. Brigadeiro Faria Lima, 3000, São Paulo - SP',
    notes: 'Empresa de tecnologia com foco em software'
  },
  { 
    id: '4', 
    name: 'Café Gourmet', 
    contact: 'Ana Ferreira',
    email: 'contato@cafegourmet.com', 
    phone: '(11) 6666-5555',
    address: 'Rua Oscar Freire, 200, São Paulo - SP',
    notes: 'Pequeno negócio de cafeteria gourmet'
  },
];

const Clients = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const filteredClients = mockClients.filter(client => {
    return client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.contact.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddClient = () => {
    // In a real app, this would send data to an API
    toast({
      title: "Cliente adicionado",
      description: "O cliente foi adicionado com sucesso.",
    });
    setIsAddClientOpen(false);
    // Reset form data
    setFormData({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const handleEditClient = (client: any) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes
    });
    setIsEditClientOpen(true);
  };

  const handleUpdateClient = () => {
    // In a real app, this would update data via an API
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas.",
    });
    setIsEditClientOpen(false);
  };

  const handleDeleteClient = (clientId: string) => {
    // In a real app, this would delete data via an API
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus clientes e contatos
            </p>
          </div>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Empresa ABC" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Pessoa de Contato</Label>
                  <Input 
                    id="contact" 
                    placeholder="Ex: João Silva" 
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Ex: contato@empresa.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Ex: (11) 9999-8888" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    placeholder="Ex: Av. Paulista, 1000, São Paulo - SP" 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Adicione observações sobre este cliente" 
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleAddClient}>
                    Salvar Cliente
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Client Dialog */}
          <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Pessoa de Contato</Label>
                  <Input 
                    id="contact" 
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleUpdateClient}>
                    Atualizar Cliente
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
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-12 text-center">
            <User2 className="size-12 text-muted-foreground mb-4" />
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
              <Card key={client.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{client.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClient(client)}>
                          <Pencil className="size-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User2 className="size-4 mr-2" />
                      <span>{client.contact}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="size-4 mr-2" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="size-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-start text-sm text-muted-foreground">
                      <Building2 className="size-4 mr-2 mt-0.5" />
                      <span>{client.address}</span>
                    </div>
                  </div>
                  
                  {client.notes && (
                    <div className="mt-4 pt-4 border-t text-sm">
                      <p className="text-muted-foreground">{client.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-secondary/50 px-6 py-4 block border-t">
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      Ver Propostas
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
