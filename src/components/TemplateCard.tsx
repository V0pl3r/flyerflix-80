
import { Lock, Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '../data/templates';
import { useState } from 'react';

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
  const [isHovering, setIsHovering] = useState(false);
  const isDesktop = window.innerWidth >= 1024; // Simple check for desktop
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <div 
      className={cn(
        "template-card group relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => isDesktop && setIsHovering(true)}
      onMouseLeave={() => isDesktop && setIsHovering(false)}
    >
      <div className="relative w-full aspect-[9/16]">
        <img 
          src={template.imageUrl} 
          alt={template.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Default info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 rounded-lg">
        <p className="text-white font-medium text-sm line-clamp-2">{template.title}</p>
        <p className="text-white/70 text-xs mt-1">Clique para visualizar</p>
      </div>
      
      {/* Hover preview for desktop */}
      {isHovering && isDesktop && (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-between p-4 animate-fade-in">
          <div>
            <p className="text-white font-medium text-sm">{template.title}</p>
            <p className="text-white/60 text-xs mt-1">{template.eventType || 'Evento geral'}</p>
          </div>
          
          <button 
            className="mt-2 bg-flyerflix-red text-white text-xs py-1.5 px-3 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <ExternalLink size={12} className="mr-1" />
            Visualizar
          </button>
        </div>
      )}
      
      {/* Premium overlay */}
      {isPremium && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <Lock className="text-white h-8 w-8 drop-shadow-lg animate-pulse" />
        </div>
      )}

      {/* Favorite button */}
      {showFavoriteButton && (
        <button
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart 
            className={cn("h-4 w-4 transition-colors", isFavorite ? "text-flyerflix-red fill-flyerflix-red" : "text-white")} 
          />
        </button>
      )}

      {/* New badge handled by parent component */}
    </div>
  );
};

export default TemplateCard;
