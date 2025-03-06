
import { useState } from 'react';
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

// Interface for Service
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
}

// Mock data for services
const initialServices = [
  { 
    id: '1', 
    name: 'Gestão de Google Ads', 
    description: 'Gestão completa de campanhas no Google Ads para aumentar o tráfego qualificado e conversões.', 
    price: 2500, 
    category: 'Marketing Digital',
    features: [
      'Configuração de campanhas',
      'Otimização contínua',
      'Relatórios semanais',
      'Acompanhamento de métricas'
    ]
  },
  { 
    id: '2', 
    name: 'Gestão de Redes Sociais', 
    description: 'Criação de conteúdo e gestão de redes sociais para aumentar o engajamento e a presença digital.', 
    price: 1800, 
    category: 'Marketing Digital',
    features: [
      'Calendário editorial',
      'Criação de conteúdo',
      'Gestão de comunidade',
      'Relatório mensal'
    ]
  },
  { 
    id: '3', 
    name: 'SEO - Otimização para Buscas', 
    description: 'Otimização de site para mecanismos de busca para aumentar o tráfego orgânico e visibilidade.', 
    price: 2000, 
    category: 'Marketing Digital',
    features: [
      'Análise de palavras-chave',
      'Otimização on-page',
      'Construção de backlinks',
      'Relatório mensal'
    ]
  },
  { 
    id: '4', 
    name: 'Identidade Visual', 
    description: 'Criação de identidade visual completa para sua marca se destacar no mercado.', 
    price: 4500, 
    category: 'Branding',
    features: [
      'Logo e variações',
      'Paleta de cores',
      'Tipografia',
      'Manual de marca'
    ]
  },
  { 
    id: '5', 
    name: 'Website Institucional', 
    description: 'Desenvolvimento de website responsivo e otimizado para SEO com foco em conversão.', 
    price: 6000, 
    category: 'Desenvolvimento',
    features: [
      'Design personalizado',
      'Responsivo para dispositivos móveis',
      'Otimizado para SEO',
      'Integração com Google Analytics'
    ]
  },
  { 
    id: '6', 
    name: 'E-mail Marketing', 
    description: 'Criação e gestão de campanhas de e-mail marketing para nutrir leads e aumentar vendas.', 
    price: 1500, 
    category: 'Marketing Digital',
    features: [
      'Criação de templates',
      'Segmentação de listas',
      'Envio de campanhas',
      'Análise de métricas'
    ]
  },
];

const Services = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState<Service[]>(initialServices);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    features: ''
  });
  
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
  const handleSaveEdit = () => {
    if (!currentService) return;
    
    const updatedServices = services.map(service => {
      if (service.id === currentService.id) {
        return {
          ...service,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
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
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (!currentService) return;
    
    const updatedServices = services.filter(service => service.id !== currentService.id);
    setServices(updatedServices);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Serviço excluído",
      description: "O serviço foi excluído com sucesso.",
      variant: "destructive"
    });
  };

  // Add new service
  const handleAddService = () => {
    const newService: Service = {
      id: (services.length + 1).toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      features: formData.features.split('\n').filter(f => f.trim() !== '')
    };
    
    setServices([...services, newService]);
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
