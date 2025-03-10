import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-primary">PropostaApp</span>
        </Link>
        
        
      </div>
    </header>
  );
};

export default Header;
