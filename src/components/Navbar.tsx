import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Package2, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    adminOnly: false
  },
  {
    title: 'Propostas',
    icon: FileText,
    href: '/create-proposal',
    adminOnly: false
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/clients',
    adminOnly: false
  },
  {
    title: 'Serviços',
    icon: Package2,
    href: '/services',
    adminOnly: false
  },
  {
    title: 'Administração',
    icon: Settings,
    href: '/admin',
    adminOnly: true
  }
];

interface NavbarProps {
  collapsed?: boolean;
}

const Navbar = ({ collapsed = false }: NavbarProps) => {
  const { signOut, isAdmin } = useAuth();
  
  return (
    <nav className={cn(
      "h-screen flex flex-col bg-card border-r pt-4 transition-all duration-300",
      collapsed ? "w-[80px]" : "w-[250px]"
    )}>
      <div className="px-4 py-2 mb-4 flex justify-center">
        {collapsed ? (
          <span className="text-2xl font-bold text-primary">P</span>
        ) : (
          <span className="text-xl font-bold text-primary">PropostaApp</span>
        )}
      </div>
      
      <div className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  {
                    "bg-primary/10 text-primary": isActive,
                    "hover:bg-muted text-foreground": !isActive
                  },
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="size-5 flex-shrink-0" />
                {!collapsed && <span className="flex-1">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            collapsed && "justify-center"
          )}
          onClick={signOut}
        >
          <LogOut className="size-5 mr-2" />
          {!collapsed && "Sair"}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
