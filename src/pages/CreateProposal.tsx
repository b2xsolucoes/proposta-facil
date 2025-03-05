
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ServiceItem from '@/components/ServiceItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  Plus,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockClients = [
  { id: '1', name: 'Empresa ABC Ltda' },
  { id: '2', name: 'Studio Design' },
  { id: '3', name: 'Tech Solutions' },
  { id: '4', name: 'Café Gourmet' },
];

const mockServices = [
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
];

const CreateProposal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalBeforeDiscount = selectedServices.reduce((total, serviceId) => {
    const service = mockServices.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
  
  const discountAmount = (totalBeforeDiscount * discount) / 100;
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  
  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };
  
  const handleNext = () => {
    if (currentStep === 1 && !selectedClient) {
      toast({
        title: "Selecione um cliente",
        description: "É necessário selecionar um cliente para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && selectedServices.length === 0) {
      toast({
        title: "Selecione um serviço",
        description: "É necessário selecionar pelo menos um serviço para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handlePreview = () => {
    navigate('/preview-proposal');
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Get step status (completed, current, upcoming)
  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };
  
  // Step component
  const Step = ({ number, title }: { number: number; title: string }) => {
    const status = getStepStatus(number);
    
    return (
      <div className="flex items-center">
        <div className={cn(
          "size-8 rounded-full flex items-center justify-center mr-3 shrink-0 transition-colors",
          status === "completed" ? "bg-primary text-primary-foreground" :
          status === "current" ? "bg-primary/10 text-primary border border-primary" :
          "bg-secondary text-muted-foreground"
        )}>
          {status === "completed" ? <CheckCircle className="size-4" /> : number}
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-medium",
            status === "completed" ? "text-primary" :
            status === "current" ? "text-foreground" :
            "text-muted-foreground"
          )}>
            {title}
          </span>
        </div>
        {number < 4 && (
          <ChevronRight className={cn(
            "mx-3 size-4",
            status === "completed" ? "text-primary" : "text-muted-foreground"
          )} />
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-container max-w-5xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Nova Proposta</h1>
          <p className="text-muted-foreground mt-2">
            Crie uma proposta personalizada para seu cliente
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="flex flex-wrap justify-between mb-8 px-1">
          <Step number={1} title="Cliente" />
          <Step number={2} title="Serviços" />
          <Step number={3} title="Detalhes" />
          <Step number={4} title="Revisão" />
        </div>
        
        <Card className="mb-8">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 size-5" />
                  Selecione o Cliente
                </CardTitle>
                <CardDescription>
                  Escolha para qual cliente esta proposta será criada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center border rounded-md p-4 bg-secondary/30">
                  <div className="flex items-center">
                    <Plus className="size-5 mr-2 text-primary" />
                    <span>Não encontrou o cliente?</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Adicionar Cliente
                  </Button>
                </div>
              </CardContent>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 size-5" />
                  Selecione os Serviços
                </CardTitle>
                <CardDescription>
                  Escolha os serviços que farão parte desta proposta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockServices.map(service => (
                    <ServiceItem 
                      key={service.id} 
                      id={service.id}
                      name={service.name}
                      description={service.description}
                      price={service.price}
                      category={service.category}
                      features={service.features}
                      isSelected={selectedServices.includes(service.id)}
                      onSelect={() => handleToggleService(service.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </>
          )}
          
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 size-5" />
                  Detalhes da Proposta
                </CardTitle>
                <CardDescription>
                  Adicione informações específicas para esta proposta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Proposta</Label>
                    <Input id="title" placeholder="Ex: Proposta de Marketing Digital" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validity">Validade (dias)</Label>
                    <Input id="validity" type="number" placeholder="15" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="introduction">Introdução</Label>
                  <Textarea 
                    id="introduction" 
                    rows={4} 
                    placeholder="Uma breve introdução para sua proposta"
                    defaultValue="Agradecemos a oportunidade de apresentar nossa proposta de serviços. Desenvolvemos soluções personalizadas que atendem às necessidades específicas do seu negócio, visando resultados concretos e mensuráveis."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="approach">Abordagem</Label>
                  <Textarea 
                    id="approach" 
                    rows={4} 
                    placeholder="Descreva sua abordagem para este projeto"
                    defaultValue="Nossa metodologia é baseada em uma análise profunda do seu mercado e público-alvo, seguida pela implementação de estratégias testadas e comprovadas. Trabalhamos de forma transparente e colaborativa, mantendo você informado em cada etapa do processo."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input 
                    id="discount" 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={discount} 
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </>
          )}
          
          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 size-5" />
                  Revisão da Proposta
                </CardTitle>
                <CardDescription>
                  Revise todos os detalhes antes de finalizar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-secondary/50 px-6 py-3 font-medium">
                    Informações Gerais
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                        <p>{mockClients.find(c => c.id === selectedClient)?.name || "Não selecionado"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Validade</h4>
                        <p>15 dias</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-secondary/50 px-6 py-3 font-medium">
                    Serviços Incluídos
                  </div>
                  <div className="divide-y">
                    {selectedServices.map(serviceId => {
                      const service = mockServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={service.id} className="p-6 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                          </div>
                          <p className="font-medium">{formatCurrency(service.price)}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-secondary/50 px-6 py-3 font-medium">
                    Resumo de Valores
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>{formatCurrency(totalBeforeDiscount)}</p>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Desconto ({discount}%)</p>
                        <p className="text-red-500">- {formatCurrency(discountAmount)}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t pt-3 font-bold">
                      <p>Total</p>
                      <p>{formatCurrency(totalAfterDiscount)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
          
          <CardFooter className="flex justify-between border-t p-6">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 size-4" />
                Anterior
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button onClick={handlePreview}>
                Visualizar Proposta
                <FileText className="ml-2 size-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateProposal;
