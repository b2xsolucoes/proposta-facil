
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, FileText, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', name: 'Clientes', icon: Users },
    { path: '/services', name: 'Serviços', icon: Settings },
    { path: '/create-proposal', name: 'Nova Proposta', icon: FileText },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        to={item.path}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-all-200",
          "hover:bg-secondary group",
          isActive ? "bg-secondary text-primary font-medium" : "text-foreground/80"
        )}
      >
        <item.icon className={cn(
          "size-5",
          isActive ? "text-primary" : "text-muted-foreground" 
        )} />
        <span className={cn(
          "transition-opacity duration-200",
          (isMobile || expanded) ? "opacity-100" : "opacity-0 hidden"
        )}>
          {item.name}
        </span>
      </Link>
    );
  };

  // Desktop sidebar
  const DesktopNav = () => (
    <aside className={cn(
      "hidden md:flex flex-col h-screen sticky top-0 bg-background border-r p-4",
      "transition-all duration-300 ease-in-out",
      expanded ? "w-56" : "w-20"
    )}>
      <div className="flex items-center justify-between mb-8">
        {expanded ? (
          <h1 className="font-semibold text-xl">PropostaApp</h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="font-bold text-primary text-2xl">P</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(prev => !prev)}
          className="size-8"
        >
          {expanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map(item => (
          <NavLink key={item.path} item={item} />
        ))}
      </nav>
      
      <div className="pt-4 border-t">
        <Link 
          to="/settings" 
          className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-all-200"
        >
          <Settings className="size-5" />
          <span className={expanded ? "" : "hidden"}>Configurações</span>
        </Link>
      </div>
    </aside>
  );

  // Mobile navigation
  const MobileNav = () => (
    <div className="block md:hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="font-semibold text-xl">PropostaApp</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileOpen(prev => !prev)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
      
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-16 animate-fade-in">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map(item => (
              <NavLink key={item.path} item={item} />
            ))}
            <Link 
              to="/settings" 
              className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-all-200"
            >
              <Settings className="size-5" />
              <span>Configurações</span>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

export default Navbar;
