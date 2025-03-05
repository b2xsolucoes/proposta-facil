
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  LayoutDashboard, 
  Users, 
  Settings,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Bem-vindo ao PropostaApp",
        description: "Um aplicativo de propostas comerciais para agências de marketing",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const features = [
    {
      icon: FileText,
      title: "Propostas Profissionais",
      description: "Crie propostas comerciais impressionantes em minutos"
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Organize seus clientes e melhore seu relacionamento"
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Analítico",
      description: "Acompanhe o desempenho das suas propostas"
    },
    {
      icon: Settings,
      title: "Catálogo de Serviços",
      description: "Gerencie seu catálogo de serviços e preços"
    }
  ];

  const handleDemoClick = () => {
    toast({
      title: "Demonstração",
      description: "O vídeo de demonstração será disponibilizado em breve!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/30 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-in">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                ✨ Versão Beta
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Propostas Comerciais Simples e Poderosas
              </h1>
              <p className="text-xl text-muted-foreground">
                Um aplicativo completo para agências de marketing criarem e gerenciarem propostas comerciais de forma profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="font-medium"
                  onClick={() => navigate('/dashboard')}
                >
                  Começar agora
                  <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="font-medium"
                  onClick={handleDemoClick}
                >
                  Ver demonstração
                  <PlayCircle className="ml-2 size-5" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-2xl border animate-scale-in">
              <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                <div className="text-center p-6">
                  <FileText className="size-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-white text-xl font-medium">
                    Prévia da aplicação
                  </h2>
                  <p className="text-zinc-400 mt-2">
                    Interface intuitiva para criação rápida de propostas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Recursos Principais</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Tudo o que você precisa para criar propostas comerciais profissionais em um único lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="rounded-lg p-6 border transition-all-200 hover:shadow-md hover:border-primary/20"
              >
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar seus processos comerciais?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece a criar propostas profissionais em minutos e aumente suas chances de conversão.
          </p>
          <Button 
            size="lg" 
            className="font-medium"
            onClick={() => navigate('/dashboard')}
          >
            Acessar a plataforma
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
