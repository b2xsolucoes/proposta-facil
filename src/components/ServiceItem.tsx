
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ServiceProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

const ServiceItem = ({ 
  id, 
  name, 
  description, 
  price, 
  category,
  features,
  isSelected,
  onSelect,
  onEdit
}: ServiceProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all-300 border h-full flex flex-col",
        isHovered ? "shadow-md" : "shadow-sm",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="secondary" className="mb-2">{category}</Badge>
            <h3 className="font-medium text-lg">{name}</h3>
          </div>
          
          {onEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {isSelected && (
            <Badge className="bg-primary text-white">
              <Check className="size-3 mr-1" /> Selecionado
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        
        {features.length > 0 && (
          <>
            <Separator className="my-4" />
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
      
      <CardFooter className="bg-secondary/50 px-6 py-4 block border-t">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">{formattedPrice}</div>
          {onSelect && (
            <Button 
              variant={isSelected ? "outline" : "default"} 
              size="sm"
              onClick={onSelect}
              className="transition-all-200"
            >
              {isSelected ? "Remover" : "Adicionar"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;
