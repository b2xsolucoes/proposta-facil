
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, name);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Bem-vindo novamente</h1>
                  <p className="text-muted-foreground mt-2">
                    Entre com suas credenciais para acessar sua conta
                  </p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                      Não tem uma conta?{' '}
                      <button 
                        type="button"
                        className="text-primary hover:underline" 
                        onClick={() => setActiveTab('register')}
                      >
                        Cadastre-se
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Crie sua conta</h1>
                  <p className="text-muted-foreground mt-2">
                    Preencha os dados abaixo para se cadastrar
                  </p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome completo</Label>
                    <Input 
                      id="register-name" 
                      placeholder="Seu nome" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                      Já tem uma conta?{' '}
                      <button 
                        type="button"
                        className="text-primary hover:underline" 
                        onClick={() => setActiveTab('login')}
                      >
                        Entrar
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
