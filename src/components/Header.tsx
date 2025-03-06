
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-primary">PropostaApp</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Olá, {user.user_metadata?.name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="size-4" />
              Entrar
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

