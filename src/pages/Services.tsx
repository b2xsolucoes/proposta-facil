import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ServiceItem from '@/components/ServiceItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Settings, Filter, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

// Interface for Service
interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  features: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

const Services = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    features: ''
  });

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Transform data to include features
      const transformedData = data.map(service => ({
        ...service,
        category: service.category || 'Outros', // Default category if not specified
        features: service.features ? JSON.parse(service.features) : []
      }));
      
      setServices(transformedData);
    };
    
    fetchServices();
  }, [user, toast]);
  
  const filteredServices = services.filter(service => {
    const queryMatch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = activeCategory === 'all' || service.category.toLowerCase() === activeCategory.toLowerCase();
    
    return queryMatch && categoryMatch;
  });

  const categories = ['all', ...new Set(services.map(service => service.category.toLowerCase()))];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Open edit dialog
  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price.toString(),
      features: service.features.join('\n')
    });
    setIsEditServiceOpen(true);
  };

  // Save edited service
  const handleSaveEdit = async () => {
    if (!currentService || !user) return;
    
    try {
      const updatedService = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        features: JSON.stringify(formData.features.split('\n').filter(f => f.trim() !== ''))
      };
      
      const { error } = await supabase
        .from('services')
        .update(updatedService)
        .eq('id', currentService.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const updatedServices = services.map(service => {
        if (service.id === currentService.id) {
          return {
            ...service,
            ...updatedService,
            features: formData.features.split('\n').filter(f => f.trim() !== '')
          };
        }
        return service;
      });
      
      setServices(updatedServices);
      setIsEditServiceOpen(false);
      
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!currentService || !user) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', currentService.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const updatedServices = services.filter(service => service.id !== currentService.id);
      setServices(updatedServices);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Add new service
  const handleAddService = async () => {
    if (!user) return;
    
    try {
      const newService = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        features: JSON.stringify(formData.features.split('\n').filter(f => f.trim() !== '')),
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Add the new service to the state with the right format
        const addedService = {
          ...data[0],
          features: formData.features.split('\n').filter(f => f.trim() !== '')
        };
        
        setServices([...services, addedService]);
        setIsAddServiceOpen(false);
        
        // Reset form
        setFormData({
          name: '',
          category: '',
          description: '',
          price: '',
          features: ''
        });
        
        toast({
          title: "Serviço adicionado",
          description: "O novo serviço foi adicionado com sucesso.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu catálogo de serviços
            </p>
          </div>
          <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                <DialogDescription>Preencha os detalhes do novo serviço</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Gestão de Redes Sociais" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input 
                    id="category" 
                    placeholder="Ex: Marketing Digital" 
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva o serviço oferecido" 
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0,00" 
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Características (uma por linha)</Label>
                  <Textarea 
                    id="features" 
                    placeholder="Digite uma característica por linha" 
                    rows={4}
                    value={formData.features}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleAddService}>
                    Salvar Serviço
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Service Dialog */}
          <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Editar Serviço</DialogTitle>
                <DialogDescription>Atualize os detalhes do serviço</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input 
                    id="category" 
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Características (uma por linha)</Label>
                  <Textarea 
                    id="features" 
                    rows={4}
                    value={formData.features}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveEdit}>
                    Atualizar Serviço
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o serviço "{currentService?.name}"? 
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center p-4">
                <AlertTriangle className="size-16 text-destructive opacity-80" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Excluir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Buscar serviços..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs 
              defaultValue="all" 
              value={activeCategory}
              onValueChange={setActiveCategory}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                {categories.filter(c => c !== 'all').map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>
        
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-12 text-center">
            <Settings className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum serviço encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não encontramos serviços que correspondam à sua busca.
            </p>
            <Button onClick={() => setIsAddServiceOpen(true)}>
              <Plus className="size-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceItem 
                key={service.id} 
                id={service.id}
                name={service.name}
                description={service.description}
                price={service.price}
                category={service.category}
                features={service.features}
                onEdit={() => handleEditService(service)}
                onDelete={() => handleDeleteClick(service)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services;
