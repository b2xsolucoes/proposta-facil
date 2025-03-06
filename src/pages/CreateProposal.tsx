
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, ArrowLeft, Eye, Save, SendHorizontal, Plus, Trash2, FileText, Edit2 } from 'lucide-react';

// Serviços disponíveis para seleção
const availableServices = [
  { id: 1, name: 'Gestão de Google Ads', description: 'Criação, gestão e otimização de campanhas no Google Ads.', price: 1200 },
  { id: 2, name: 'Gestão de Redes Sociais', description: 'Criação de conteúdo e gestão de perfis em redes sociais.', price: 1500 },
  { id: 3, name: 'SEO', description: 'Otimização de site para mecanismos de busca.', price: 1800 },
  { id: 4, name: 'Email Marketing', description: 'Criação e envio de campanhas de email marketing.', price: 800 },
  { id: 5, name: 'Branding', description: 'Desenvolvimento de identidade visual e estratégia de marca.', price: 3500 },
  { id: 6, name: 'Desenvolvimento de Site', description: 'Criação de sites responsivos e otimizados.', price: 5000 },
  { id: 7, name: 'Landing Pages', description: 'Criação de páginas de conversão otimizadas.', price: 1200 },
];

// Lista de clientes disponíveis para seleção (simulando dados)
const availableClients = [
  { id: 1, name: 'Empresa ABC', email: 'contato@empresaabc.com' },
  { id: 2, name: 'Studio Design', email: 'contato@studiodesign.com' },
  { id: 3, name: 'Tech Solutions', email: 'contato@techsolutions.com' },
  { id: 4, name: 'Café Gourmet', email: 'contato@cafegourmet.com' },
];

// Interface para o serviço selecionado
interface SelectedService {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number; // Store the original price for reference
  quantity: number;
  observations?: string;
  customPrice?: boolean; // Flag to indicate if price was customized
}

const CreateProposal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados para o formulário
  const [activeTab, setActiveTab] = useState('info');
  const [clientId, setClientId] = useState<string>('');
  const [title, setTitle] = useState('Proposta Comercial');
  const [validity, setValidity] = useState('15');
  const [introduction, setIntroduction] = useState('Agradecemos a oportunidade de apresentar nossa proposta. Abaixo, detalhamos os serviços oferecidos conforme discutido em nossa reunião.');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [discount, setDiscount] = useState<string>('0');
  const [taxPercentage, setTaxPercentage] = useState<string>('0');
  const [includeTax, setIncludeTax] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState('Pagamento em até 15 dias após a aprovação da proposta.');
  // Track which service is being edited
  const [editingServicePrice, setEditingServicePrice] = useState<number | null>(null);
  // Store temporary price when editing
  const [tempPrice, setTempPrice] = useState<string>('');
  
  // Cálculos de valores
  const subtotal = selectedServices.reduce((acc, service) => acc + (service.price * service.quantity), 0);
  const discountValue = (parseFloat(discount) / 100) * subtotal;
  const totalBeforeTax = subtotal - discountValue;
  const taxValue = includeTax ? (parseFloat(taxPercentage) / 100) * totalBeforeTax : 0;
  const total = totalBeforeTax + taxValue;
  
  // Funções para gerenciar serviços
  const addService = (serviceId: string) => {
    const serviceToAdd = availableServices.find(s => s.id === parseInt(serviceId));
    if (!serviceToAdd) return;
    
    const newService: SelectedService = {
      ...serviceToAdd,
      originalPrice: serviceToAdd.price, // Store original price
      quantity: 1,
      observations: '',
      customPrice: false
    };
    
    setSelectedServices([...selectedServices, newService]);
  };
  
  const removeService = (index: number) => {
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    setSelectedServices(updatedServices);
  };
  
  const updateServiceQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedServices = [...selectedServices];
    updatedServices[index].quantity = quantity;
    setSelectedServices(updatedServices);
  };
  
  const updateServiceObservations = (index: number, observations: string) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].observations = observations;
    setSelectedServices(updatedServices);
  };

  // New functions for price editing
  const startEditingPrice = (index: number) => {
    setEditingServicePrice(index);
    setTempPrice(selectedServices[index].price.toString());
  };

  const cancelEditingPrice = () => {
    setEditingServicePrice(null);
    setTempPrice('');
  };

  const saveEditedPrice = (index: number) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    const updatedServices = [...selectedServices];
    updatedServices[index].price = newPrice;
    updatedServices[index].customPrice = newPrice !== updatedServices[index].originalPrice;
    setSelectedServices(updatedServices);
    setEditingServicePrice(null);
  };

  const resetToOriginalPrice = (index: number) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].price = updatedServices[index].originalPrice;
    updatedServices[index].customPrice = false;
    setSelectedServices(updatedServices);
    toast({
      title: "Preço restaurado",
      description: "O preço foi restaurado para o valor original.",
    });
  };
  
  // Função para salvar a proposta
  const saveProposal = (asDraft: boolean = true) => {
    if (!clientId) {
      toast({
        title: "Erro ao salvar",
        description: "Selecione um cliente para a proposta.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedServices.length === 0) {
      toast({
        title: "Erro ao salvar",
        description: "Adicione pelo menos um serviço à proposta.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulando o salvamento
    toast({
      title: asDraft ? "Rascunho salvo" : "Proposta salva",
      description: asDraft 
        ? "Sua proposta foi salva como rascunho." 
        : "Sua proposta foi salva com sucesso.",
    });
    
    if (!asDraft) {
      navigate('/dashboard');
    }
  };
  
  // Função para simular o envio da proposta por email
  const sendProposal = () => {
    if (!clientId) {
      toast({
        title: "Erro ao enviar",
        description: "Selecione um cliente para a proposta.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedServices.length === 0) {
      toast({
        title: "Erro ao enviar",
        description: "Adicione pelo menos um serviço à proposta.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Proposta enviada",
      description: "A proposta foi enviada ao cliente por email.",
    });
    
    navigate('/dashboard');
  };
  
  // Função para prévia da proposta
  const previewProposal = () => {
    if (!clientId) {
      toast({
        title: "Não é possível visualizar",
        description: "Selecione um cliente para a proposta.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedServices.length === 0) {
      toast({
        title: "Não é possível visualizar",
        description: "Adicione pelo menos um serviço à proposta.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulamos a navegação para a página de prévia
    // Na implementação real, passaríamos os dados da proposta
    navigate('/preview-proposal');
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
            <ArrowLeft className="size-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Nova Proposta</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Informações Gerais</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="payment">Pagamento e Termos</TabsTrigger>
          </TabsList>
          
          {/* Informações Gerais */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Proposta</CardTitle>
                <CardDescription>Preencha as informações básicas da proposta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client">Cliente</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClients.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Título da Proposta</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="validity">Validade (dias)</Label>
                    <Input 
                      id="validity" 
                      type="number" 
                      value={validity} 
                      onChange={(e) => setValidity(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="introduction">Introdução</Label>
                    <Textarea 
                      id="introduction" 
                      value={introduction} 
                      onChange={(e) => setIntroduction(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancelar</Button>
                <Button onClick={() => setActiveTab('services')}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Serviços */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Oferecidos</CardTitle>
                <CardDescription>Adicione os serviços que farão parte desta proposta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="service">Adicionar Serviço</Label>
                    <Select onValueChange={addService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map(service => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="mb-[1px]" onClick={() => addService('1')}>
                      <Plus className="size-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                
                {selectedServices.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    {selectedServices.map((service, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="p-4 bg-secondary/50">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{service.name}</h4>
                            <Button variant="ghost" size="icon" onClick={() => removeService(index)}>
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex gap-4">
                            <div className="w-1/3">
                              <Label htmlFor={`quantity-${index}`}>Quantidade</Label>
                              <div className="flex items-center">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => updateServiceQuantity(index, service.quantity - 1)}
                                  disabled={service.quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input 
                                  id={`quantity-${index}`} 
                                  type="number" 
                                  className="mx-2 text-center"
                                  value={service.quantity} 
                                  onChange={(e) => updateServiceQuantity(index, parseInt(e.target.value) || 1)}
                                  min="1"
                                />
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => updateServiceQuantity(index, service.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="w-2/3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`price-${index}`}>
                                  Valor {service.customPrice && <span className="text-xs text-primary">(Personalizado)</span>}
                                </Label>
                                {service.customPrice && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={() => resetToOriginalPrice(index)}
                                  >
                                    Restaurar valor original
                                  </Button>
                                )}
                              </div>
                              
                              {editingServicePrice === index ? (
                                <div className="flex items-center gap-2">
                                  <Input 
                                    id={`price-edit-${index}`} 
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => saveEditedPrice(index)}
                                    className="whitespace-nowrap"
                                  >
                                    Salvar
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={cancelEditingPrice}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Input 
                                    id={`price-${index}`} 
                                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price * service.quantity)}
                                    disabled
                                    className="flex-1"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => startEditingPrice(index)}
                                    title="Editar preço"
                                  >
                                    <Edit2 className="size-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`observations-${index}`}>Observações</Label>
                            <Textarea 
                              id={`observations-${index}`} 
                              value={service.observations || ''} 
                              onChange={(e) => updateServiceObservations(index, e.target.value)}
                              placeholder="Adicione observações específicas para este serviço"
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-secondary/30 rounded-lg">
                    <FileText className="size-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Nenhum serviço adicionado</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adicione serviços à proposta usando o seletor acima.
                    </p>
                  </div>
                )}
                
                {selectedServices.length > 0 && (
                  <div className="mt-6 p-4 border rounded-lg bg-secondary/20">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setActiveTab('info')}>Voltar</Button>
                <Button onClick={() => setActiveTab('payment')}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pagamento e Termos */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento e Termos</CardTitle>
                <CardDescription>Configure os detalhes de pagamento e finalize a proposta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="discount">Desconto (%)</Label>
                    <Input 
                      id="discount" 
                      type="number" 
                      value={discount} 
                      onChange={(e) => setDiscount(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="flex items-end space-x-4">
                    <div className="flex items-center space-x-2 h-10">
                      <Checkbox 
                        id="includeTax" 
                        checked={includeTax}
                        onCheckedChange={(checked) => setIncludeTax(checked as boolean)}
                      />
                      <Label htmlFor="includeTax">Incluir impostos</Label>
                    </div>
                    
                    {includeTax && (
                      <div className="flex-1">
                        <Input 
                          type="number" 
                          value={taxPercentage} 
                          onChange={(e) => setTaxPercentage(e.target.value)}
                          min="0"
                          max="100"
                          placeholder="% de impostos"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                  <Textarea 
                    id="paymentTerms" 
                    value={paymentTerms} 
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="mt-6 p-6 border rounded-lg bg-secondary/20 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Desconto ({discount}%):</span>
                    <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountValue)}</span>
                  </div>
                  
                  {includeTax && (
                    <div className="flex justify-between">
                      <span>Impostos ({taxPercentage}%):</span>
                      <span>+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(taxValue)}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t mt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                  </div>
                </div>
                
                {clientId === '' && (
                  <div className="flex items-center p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800">
                    <AlertCircle className="size-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Selecione um cliente na aba "Informações Gerais" antes de finalizar.</p>
                  </div>
                )}
                
                {selectedServices.length === 0 && (
                  <div className="flex items-center p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800">
                    <AlertCircle className="size-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Adicione pelo menos um serviço na aba "Serviços" antes de finalizar.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between flex-wrap gap-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('services')}>
                    Voltar
                  </Button>
                  <Button variant="outline" onClick={() => saveProposal(true)}>
                    <Save className="size-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={previewProposal}>
                    <Eye className="size-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button onClick={sendProposal}>
                    <SendHorizontal className="size-4 mr-2" />
                    Finalizar e Enviar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreateProposal;
