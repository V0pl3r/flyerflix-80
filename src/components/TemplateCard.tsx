
import { Lock, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Template } from '../data/templates';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  isPremium?: boolean;
  isFavorite?: boolean;
  className?: string;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
}

const TemplateCard = ({ 
  template, 
  onClick, 
  isPremium = false, 
  isFavorite = false,
  className,
  onToggleFavorite,
  showFavoriteButton = false
}: TemplateCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <div 
      className={cn("template-card group relative cursor-pointer transition-all duration-300 rounded overflow-hidden", className)}
      onClick={onClick}
    >
      <AspectRatio ratio={9/16} className="w-full">
        <img 
          src={template.imageUrl} 
          alt={template.title}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 rounded">
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

      {/* Favorite button */}
      {showFavoriteButton && (
        <button
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={cn("h-4 w-4 transition-colors", isFavorite ? "text-flyerflix-red fill-flyerflix-red" : "text-white")} 
          />
        </button>
      )}
      
      {/* New badge - will be shown in TemplateCarousel component */}
    </div>
  );
};

export default TemplateCard;
