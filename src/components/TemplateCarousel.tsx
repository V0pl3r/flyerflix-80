
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star, Users } from 'lucide-react';
import TemplateCard from './TemplateCard';
import TemplateSkeleton from './TemplateSkeleton';
import { Template } from '../data/templates';
import { AspectRatio } from './ui/aspect-ratio';
import { Collapsible, CollapsibleContent } from './ui/collapsible';

interface TemplateCarouselProps {
  title: string;
  templates: Template[];
  isPremiumSection?: boolean;
  onTemplateClick?: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void;
  onToggleFavorite?: (template: Template) => void;
  favoritesIds?: string[];
  showFavoriteButtons?: boolean;
  isLoading?: boolean;
  isWeeklyPopular?: boolean;
  isCreatorUsed?: boolean;
  isRecommended?: boolean;
}

const TemplateCarousel = ({ 
  title, 
  templates, 
  isPremiumSection = false,
  onTemplateClick,
  onPreviewTemplate,
  onToggleFavorite,
  favoritesIds = [],
  showFavoriteButtons = false,
  isLoading = false,
  isWeeklyPopular = false,
  isCreatorUsed = false,
  isRecommended = false
}: TemplateCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const totalImages = templates.length;

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

  // Reset image loaded count when templates change
  useEffect(() => {
    setImagesLoaded(0);
  }, [templates]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

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
  
  const handlePreviewTemplate = (template: Template) => {
    if (onPreviewTemplate) {
      onPreviewTemplate(template);
    }
  };

  if (templates.length === 0 && !isLoading) {
    return null;
  }

  const isFullyLoaded = imagesLoaded >= totalImages;
  
  // Animation classes for smooth transitions
  const fadeInClass = "animate-fade-in transition-all duration-300";

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className="py-6 w-full transition-all duration-300"
    >
      <div className="px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold flex items-center">
              {title}
              {isPremiumSection && (
                <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-medium ml-3 px-2.5 py-0.5 rounded">
                  Premium
                </span>
              )}
              {isWeeklyPopular && (
                <span className="bg-flyerflix-red text-white text-xs font-medium ml-3 px-2.5 py-0.5 rounded flex items-center">
                  <Star size={12} className="mr-1" /> Populares da semana
                </span>
              )}
              {isRecommended && (
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium ml-3 px-2.5 py-0.5 rounded">
                  Recomendados para você
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>
      
      <CollapsibleContent>
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
            className={`flex px-4 md:px-8 lg:px-12 xl:px-16 space-x-4 overflow-x-auto scrollbar-none pb-6 max-w-full scroll-smooth ${fadeInClass}`}
            onScroll={checkArrows}
          >
            {isLoading || !isFullyLoaded ? (
              // Loading skeletons with fade in animation
              <TemplateSkeleton count={5} />
            ) : templates.length > 0 ? (
              // Actual templates with fade in animation
              templates.map((template) => (
                <div 
                  key={template.id}
                  className={`template-card flex-none w-[180px] md:w-[200px] lg:w-[220px] relative ${fadeInClass}`}
                >
                  <TemplateCard 
                    template={template} 
                    onClick={() => handleTemplateClick(template)} 
                    isPremium={template.isPremium}
                    isFavorite={favoritesIds.includes(template.id)}
                    onToggleFavorite={() => handleToggleFavorite(template)}
                    showFavoriteButton={showFavoriteButtons}
                    onPreview={() => handlePreviewTemplate(template)}
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

                  {/* Used by creators badge */}
                  {isCreatorUsed && template.usageCount && (
                    <div className="absolute bottom-2 left-2 right-2 z-10">
                      <div className="bg-black/60 backdrop-blur-sm text-white text-xs rounded px-2 py-1 flex items-center">
                        <Users size={12} className="mr-1" />
                        <span>{template.usageCount}+ criadores</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Hidden image loader to track load progress */}
                  <img 
                    src={template.imageUrl} 
                    alt=""
                    className="hidden"
                    onLoad={handleImageLoad}
                  />
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TemplateCarousel;
