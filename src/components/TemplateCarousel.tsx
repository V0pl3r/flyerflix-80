
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import TemplateCard from './TemplateCard';
import { Template } from '../data/templates';

interface TemplateCarouselProps {
  title: string;
  templates: Template[];
  isPremiumSection?: boolean;
}

const TemplateCarousel = ({ title, templates, isPremiumSection = false }: TemplateCarouselProps) => {
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
      setTotalSlides(Math.ceil(templates.length / visibleItems));
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

  return (
    <section className="py-6 w-full">
      <div className="px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {isPremiumSection && (
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-amber-400 text-black ml-3">
              Premium
            </Badge>
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
          className="flex px-4 md:px-8 lg:px-12 xl:px-16 space-x-4 overflow-x-auto scrollbar-none pb-6 max-w-full"
          onScroll={checkArrows}
        >
          {templates.map((template) => (
            <div 
              key={template.id}
              className="template-card flex-none w-[180px] md:w-[200px] lg:w-[220px] relative"
            >
              <TemplateCard 
                template={template} 
                onClick={() => {}} // This will be replaced when we use the component
                isPremium={template.isPremium}
                className="w-full h-full aspect-[9/16]"
              />
              
              {/* New badge */}
              {template.isNew && (
                <div className="absolute top-2 left-2 z-20">
                  <Badge variant="default" className="bg-flyerflix-red text-white text-xs px-2 py-0.5">
                    Novo
                  </Badge>
                </div>
              )}
            </div>
          ))}
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
                  currentPosition === index ? "w-4 bg-flyerflix-red" : "w-2 bg-white/30"
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
