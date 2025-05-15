
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import TemplateCard from './TemplateCard';
import { Template } from '../data/templates';

interface TemplateCarouselProps {
  title: string;
  templates: Template[];
  isPremiumSection?: boolean;
  onTemplateClick?: (template: Template) => void;
  onToggleFavorite?: (template: Template) => void;
  favoritesIds?: string[];
  showFavoriteButtons?: boolean;
  isLoading?: boolean;
}

const TemplateCarousel = ({ 
  title, 
  templates, 
  isPremiumSection = false,
  onTemplateClick,
  onToggleFavorite,
  favoritesIds = [],
  showFavoriteButtons = false,
  isLoading = false
}: TemplateCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    // Calculate total number of slides
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      const itemWidth = 220; // Approximate width of each item with margin
      const visibleItems = Math.floor(containerWidth / itemWidth);
      setTotalSlides(Math.max(1, Math.ceil(templates.length / visibleItems)));
    }
    
    // Check arrows on initial load
    checkArrows();
    
    // Add resize listener
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [templates]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(checkArrows, 300);
      setCurrentPosition(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(checkArrows, 300);
      setCurrentPosition(prev => Math.min(totalSlides - 1, prev + 1));
    }
  };

  const checkArrows = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleTemplateClick = (template: Template) => {
    if (onTemplateClick) {
      onTemplateClick(template);
    }
  };

  const handleToggleFavorite = (template: Template) => {
    if (onToggleFavorite) {
      onToggleFavorite(template);
    }
  };

  return (
    <section className="py-6 w-full">
      <div className="px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {isPremiumSection && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-medium ml-3 px-2.5 py-0.5 rounded">
              Premium
            </span>
          )}
        </div>
      </div>
      
      <div className="carousel-container relative group w-full overflow-visible">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity hidden md:block"
            aria-label="Previous templates"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {/* Templates Container */}
        <div 
          ref={carouselRef}
          className="flex px-4 md:px-8 lg:px-12 xl:px-16 space-x-4 overflow-x-auto scrollbar-none pb-6 max-w-full scroll-smooth"
          onScroll={checkArrows}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-none w-[180px] md:w-[200px] lg:w-[220px]">
                <div className="aspect-[9/16] bg-white/5 rounded-md overflow-hidden relative">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>
            ))
          ) : templates.length > 0 ? (
            // Actual templates
            templates.map((template) => (
              <div 
                key={template.id}
                className="template-card flex-none w-[180px] md:w-[200px] lg:w-[220px] relative"
              >
                <TemplateCard 
                  template={template} 
                  onClick={() => handleTemplateClick(template)} 
                  isPremium={template.isPremium}
                  isFavorite={favoritesIds.includes(template.id)}
                  onToggleFavorite={() => handleToggleFavorite(template)}
                  showFavoriteButton={showFavoriteButtons}
                  className="w-full h-full aspect-[9/16]"
                />
                
                {/* New badge */}
                {template.isNew && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-flyerflix-red text-white text-xs font-medium px-2 py-0.5 rounded shadow-lg">
                      Novo
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            // No templates message
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-white/50 text-center">Nenhum template encontrado nesta categoria.</p>
            </div>
          )}
        </div>
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity hidden md:block"
            aria-label="Next templates"
          >
            <ArrowRight size={20} />
          </button>
        )}
        
        {/* Carousel indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center space-x-1 mt-2">
            {[...Array(totalSlides)].map((_, index) => (
              <div 
                key={index}
                className={`h-1 rounded-full transition-all ${
                  currentPosition === index ? "w-6 bg-flyerflix-red" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateCarousel;
