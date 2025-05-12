
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Template = {
  id: number | string;  
  title: string;
  imageUrl: string;
  category?: string;    
  isPremium?: boolean;
  canvaUrl?: string;
};

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  isPremium?: boolean;
}

const TemplateCard = ({ template, onClick, isPremium = false }: TemplateCardProps) => {
  return (
    <div 
      className="template-card group relative cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={template.imageUrl} 
        alt={template.title}
        className="w-full h-full object-cover rounded"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 rounded">
        <p className="text-white font-medium text-sm">{template.title}</p>
        <p className="text-white/70 text-xs mt-1">Clique para baixar</p>
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
