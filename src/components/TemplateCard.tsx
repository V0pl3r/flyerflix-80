
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Template } from '../data/templates';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  isPremium?: boolean;
  className?: string;
}

const TemplateCard = ({ template, onClick, isPremium = false, className }: TemplateCardProps) => {
  return (
    <div 
      className={cn("template-card group relative cursor-pointer transition-all duration-300", className)}
      onClick={onClick}
    >
      <img 
        src={template.imageUrl} 
        alt={template.title}
        className="w-full h-full object-cover rounded"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 rounded">
        <p className="text-white font-medium text-sm">{template.title}</p>
        <p className="text-white/70 text-xs mt-1">Clique para visualizar</p>
      </div>
      
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-flyerflix-red text-white text-xs">Premium</Badge>
        </div>
      )}
      
      {/* Premium overlay */}
      {isPremium && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Lock className="text-white h-8 w-8" />
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
