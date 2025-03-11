
import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

// Interface for client data
interface Client {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
}

const Clients = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  // Fetch clients from Supabase
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setClients(data as Client[]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    return (
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.contact && client.contact.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddClient = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome da empresa é obrigatório.",
          variant: "destructive"
        });
        return;
      }

      // Insert client into Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            name: formData.name,
            contact: formData.contact || null,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
            notes: formData.notes || null,
            user_id: user?.id || '00000000-0000-0000-0000-000000000000' // Fallback for testing
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });
      
      // Add the new client to the state
      if (data && data.length > 0) {
        setClients(prev => [...prev, data[0] as Client]);
      }

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
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível adicionar o cliente. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      contact: client.contact || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || ''
    });
    setIsEditClientOpen(true);
  };

  const handleUpdateClient = async () => {
    if (!currentClient) return;
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome da empresa é obrigatório.",
          variant: "destructive"
        });
        return;
      }

      // Update client in Supabase
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          contact: formData.contact || null,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentClient.id);

      if (error) {
        throw error;
      }

      // Update client in state
      setClients(prev => 
        prev.map(client => 
          client.id === currentClient.id 
            ? { 
                ...client, 
                name: formData.name,
                contact: formData.contact || null,
                email: formData.email || null,
                phone: formData.phone || null,
                address: formData.address || null,
                notes: formData.notes || null
              } 
            : client
        )
      );

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas.",
      });
      
      setIsEditClientOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar as informações do cliente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      // Delete client from Supabase
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      // Remove client from state
      setClients(prev => prev.filter(client => client.id !== clientId));

      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive"
      });
    }
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
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : filteredClients.length === 0 ? (
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
                    {client.contact && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User2 className="size-4 mr-2" />
                        <span>{client.contact}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="size-4 mr-2" />
                        <span>{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="size-4 mr-2" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start text-sm text-muted-foreground">
                        <Building2 className="size-4 mr-2 mt-0.5" />
                        <span>{client.address}</span>
                      </div>
                    )}
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
