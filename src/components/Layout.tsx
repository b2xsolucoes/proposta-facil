
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navbar />
      <main className={cn("flex-1 animate-fade-in", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
