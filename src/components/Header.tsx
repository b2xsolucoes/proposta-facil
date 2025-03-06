
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-primary">PropostaApp</span>
        </Link>
        
        <Button variant="outline" size="sm" asChild>
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="size-4" />
            Entrar
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
