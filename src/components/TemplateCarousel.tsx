
import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Template {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

interface TemplateCarouselProps {
  title: string;
  templates: Template[];
}

const TemplateCarousel = ({ title, templates }: TemplateCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(checkArrows, 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(checkArrows, 300);
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
    <section className="py-10">
      <div className="flyerflix-container">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      </div>
      
      <div className="carousel-container relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity hidden md:block"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {/* Templates Container */}
        <div 
          ref={carouselRef}
          className="flex px-4 md:px-8 lg:px-12 xl:px-16 space-x-4 overflow-x-auto scrollbar-none pb-6"
          onScroll={checkArrows}
        >
          {templates.map((template) => (
            <div 
              key={template.id}
              className="template-card flex-none w-[180px] md:w-[200px] lg:w-[220px]"
            >
              <img 
                src={template.imageUrl} 
                alt={template.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                <p className="text-sm font-medium">{template.title}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity hidden md:block"
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default TemplateCarousel;
