
import { Lock, Heart, ExternalLink, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '../data/templates';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  isPremium?: boolean;
  isFavorite?: boolean;
  className?: string;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
  onPreview?: () => void;
}

const TemplateCard = ({ 
  template, 
  onClick, 
  isPremium = false, 
  isFavorite = false,
  className,
  onToggleFavorite,
  showFavoriteButton = false,
  onPreview
}: TemplateCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDesktop = window.innerWidth >= 1024; // Simple check for desktop

  // Fallback image if imageUrl is missing/invalid
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=700';
  const templateImage = template.imageUrl && template.imageUrl.trim() !== '' ? template.imageUrl : fallbackImage;

  useEffect(() => {
    // Apply subtle entrance animation when the card first appears
    const card = cardRef.current;
    if (card) {
      card.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        card.classList.remove('opacity-0', 'translate-y-4');
        card.classList.add('opacity-100', 'translate-y-0', 'transition-all', 'duration-500');
      }, 100 + Math.random() * 300); // Staggered timing for grid of cards
    }
  }, []);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview();
    }
  };

  const handleClick = () => {
    console.log('Template clicado:', template.title, template.id);
    onClick();
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "template-card group relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.03]",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => isDesktop && setIsHovering(true)}
      onMouseLeave={() => isDesktop && setIsHovering(false)}
    >
      <div className="relative w-full aspect-[9/16]">
        <img 
          src={templateImage} 
          alt={template.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        
        {/* Watermark overlay - only shown in preview */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white font-bold text-2xl opacity-20 rotate-[-30deg]">
            FLYERFLIX
          </p>
        </div>
      </div>
      
      {/* Default info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-lg">
        <p className="text-white font-medium text-sm line-clamp-2 transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">{template.title}</p>
        <p className="text-white/70 text-xs mt-1 transform transition-all duration-300 group-hover:translate-y-0 translate-y-4 group-hover:opacity-100 opacity-0">Clique para visualizar</p>
      </div>
      
      {/* Quick action buttons */}
      <div className="absolute bottom-2 right-2 z-20 flex gap-1">
        {onPreview && (
          <button
            className="p-1.5 rounded-full bg-black/50 hover:bg-flyerflix-red/80 transition-colors transform transition-transform duration-200 active:scale-90"
            onClick={handlePreviewClick}
            aria-label="Visualizar"
          >
            <Eye className="h-4 w-4 text-white" />
          </button>
        )}
      </div>
      
      {/* Hover preview for desktop */}
      {isHovering && isDesktop && (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-between p-4 animate-fade-in">
          <div>
            <p className="text-white font-medium text-sm">{template.title}</p>
            <p className="text-white/60 text-xs mt-1">{template.eventType || 'Evento geral'}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            {onPreview && (
              <Button 
                variant="outline"
                className="mt-2 bg-white/10 text-white text-xs py-1.5 px-3 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
                onClick={handlePreviewClick}
              >
                <Eye size={12} className="mr-1" />
                Pré-visualizar
              </Button>
            )}
            <button 
              className="mt-2 bg-flyerflix-red text-white text-xs py-1.5 px-3 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-200 hover:-translate-y-0.5"
            >
              <ExternalLink size={12} className="mr-1" />
              Visualizar completo
            </button>
          </div>
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
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors transform transition-transform duration-200 active:scale-90"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart 
            className={cn("h-4 w-4 transition-all duration-300", isFavorite ? "text-flyerflix-red fill-flyerflix-red scale-110" : "text-white")} 
          />
        </button>
      )}
    </div>
  );
};

export default TemplateCard;

