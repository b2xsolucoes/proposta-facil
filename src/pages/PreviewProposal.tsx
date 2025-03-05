
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Mail, Share, FileText, CheckCircle } from 'lucide-react';

const PreviewProposal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSendEmailOpen(false);
    
    // Show success toast
    toast({
      title: "Proposta enviada com sucesso!",
      description: "O cliente receberá a proposta por e-mail em instantes.",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "Sua proposta está sendo baixada como PDF.",
    });
  };

  return (
    <Layout>
      <div className="page-container max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate('/create-proposal')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar para Edição
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Visualizar Proposta</h1>
              <p className="text-muted-foreground mt-1">
                Proposta de Marketing Digital - Studio Design
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Mail className="mr-2 size-4" />
                    Enviar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enviar Proposta por E-mail</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSendEmail} className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="to">Para</Label>
                      <Input id="to" type="email" placeholder="cliente@exemplo.com" defaultValue="contato@studiodesign.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" placeholder="Assunto do e-mail" defaultValue="Proposta de Marketing Digital - PropostaApp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <textarea 
                        id="message" 
                        className="w-full min-h-32 p-3 border rounded-lg"
                        placeholder="Mensagem para o cliente"
                        defaultValue="Olá,

Segue em anexo a proposta de Marketing Digital conforme conversamos. Estou à disposição para quaisquer esclarecimentos adicionais.

Atenciosamente,
Equipe PropostaApp"
                      />
                    </div>
                    <div className="pt-3 flex justify-end">
                      <Button type="submit">
                        <Mail className="mr-2 size-4" />
                        Enviar Proposta
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 size-4" />
                Download PDF
              </Button>
              
              <Button>
                <Share className="mr-2 size-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="preview" className="mb-8">
          <TabsList>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-8 pt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary p-12 text-center text-white">
                  <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Proposta de Marketing Digital</h1>
                    <p className="text-lg opacity-90">Elaborada especialmente para Studio Design</p>
                    <div className="flex justify-center mt-6">
                      <div className="size-20 bg-white rounded-full flex items-center justify-center">
                        <FileText className="size-10 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <div className="max-w-3xl mx-auto space-y-10">
                    <section>
                      <h2 className="text-2xl font-medium mb-4">Introdução</h2>
                      <p className="text-muted-foreground">
                        Agradecemos a oportunidade de apresentar nossa proposta de serviços. Desenvolvemos soluções personalizadas que atendem às necessidades específicas do seu negócio, visando resultados concretos e mensuráveis.
                      </p>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-medium mb-4">Nossa Abordagem</h2>
                      <p className="text-muted-foreground mb-4">
                        Nossa metodologia é baseada em uma análise profunda do seu mercado e público-alvo, seguida pela implementação de estratégias testadas e comprovadas. Trabalhamos de forma transparente e colaborativa, mantendo você informado em cada etapa do processo.
                      </p>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-medium mb-6">Serviços Propostos</h2>
                      
                      <div className="space-y-6">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-secondary/50 px-6 py-4 font-medium">
                            Gestão de Google Ads
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-muted-foreground">
                                  Gestão completa de campanhas no Google Ads para aumentar o tráfego qualificado e conversões.
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">R$ 2.500,00</div>
                                <div className="text-sm text-muted-foreground">por mês</div>
                              </div>
                            </div>
                            
                            <h4 className="font-medium mb-2">O que está incluído:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Configuração de campanhas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Otimização contínua</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Relatórios semanais</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Acompanhamento de métricas</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-secondary/50 px-6 py-4 font-medium">
                            Gestão de Redes Sociais
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-muted-foreground">
                                  Criação de conteúdo e gestão de redes sociais para aumentar o engajamento e a presença digital.
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">R$ 1.800,00</div>
                                <div className="text-sm text-muted-foreground">por mês</div>
                              </div>
                            </div>
                            
                            <h4 className="font-medium mb-2">O que está incluído:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Calendário editorial</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Criação de conteúdo</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Gestão de comunidade</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                <span>Relatório mensal</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-medium mb-6">Investimento</h2>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-6 space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Gestão de Google Ads</p>
                            <p>R$ 2.500,00</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Gestão de Redes Sociais</p>
                            <p>R$ 1.800,00</p>
                          </div>
                          <div className="flex justify-between items-center border-t pt-3">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p>R$ 4.300,00</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Desconto (10%)</p>
                            <p className="text-red-500">- R$ 430,00</p>
                          </div>
                          <div className="flex justify-between items-center border-t pt-3 font-bold text-lg">
                            <p>Total Mensal</p>
                            <p>R$ 3.870,00</p>
                          </div>
                        </div>
                      </div>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-medium mb-4">Próximos Passos</h2>
                      <p className="text-muted-foreground mb-4">
                        Para darmos início ao projeto, seguiremos os seguintes passos:
                      </p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li className="text-muted-foreground">Aprovação da proposta</li>
                        <li className="text-muted-foreground">Reunião inicial para alinhamento de expectativas</li>
                        <li className="text-muted-foreground">Definição de cronograma detalhado</li>
                        <li className="text-muted-foreground">Início das implementações</li>
                      </ol>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-medium mb-4">Validade</h2>
                      <p className="text-muted-foreground">
                        Esta proposta tem validade de 15 dias a partir da data de envio.
                      </p>
                    </section>
                    
                    <section className="border-t pt-8">
                      <div className="text-center">
                        <p className="font-medium mb-2">Aguardamos seu contato para darmos início a esta parceria.</p>
                        <p className="text-muted-foreground">contato@propostaapp.com | (11) 98765-4321</p>
                      </div>
                    </section>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Opções de Documento</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="template">Modelo de Documento</Label>
                    <select 
                      id="template" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="modern"
                    >
                      <option value="modern">Moderno</option>
                      <option value="classic">Clássico</option>
                      <option value="minimal">Minimalista</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="color">Cor Principal</Label>
                    <div className="flex gap-2">
                      <div className="size-6 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-blue-500"></div>
                      <div className="size-6 rounded-full bg-purple-500 cursor-pointer"></div>
                      <div className="size-6 rounded-full bg-green-500 cursor-pointer"></div>
                      <div className="size-6 rounded-full bg-orange-500 cursor-pointer"></div>
                      <div className="size-6 rounded-full bg-red-500 cursor-pointer"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="footer">Texto do Rodapé</Label>
                    <Input id="footer" defaultValue="contato@propostaapp.com | (11) 98765-4321" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="showLogo" className="rounded border-gray-300" />
                    <Label htmlFor="showLogo">Exibir logotipo</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PreviewProposal;
