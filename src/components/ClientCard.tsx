
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, FileText, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ClientProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  proposalsCount: number;
}

const ClientCard = ({ id, name, email, phone, proposalsCount }: ClientProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all-300 border",
        isHovered ? "shadow-md" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
            
            <div className="flex items-center text-muted-foreground text-sm gap-2 mt-1">
              <Mail className="size-4" />
              <span className="truncate max-w-52">{email}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm gap-2">
              <Phone className="size-4" />
              <span>{phone}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm gap-2">
              <FileText className="size-4" />
              <span>{proposalsCount} propostas</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Ver propostas</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      
      <CardFooter className="bg-secondary/50 px-6 py-4">
        <div className="w-full flex justify-between items-center">
          <Button variant="outline" size="sm" className="transition-all-200">
            Ver detalhes
          </Button>
          <Button variant="default" size="sm" className="transition-all-200">
            Nova proposta
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
