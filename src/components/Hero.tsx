
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate elements on mount with staggered timing
    const title = titleRef.current;
    const description = descRef.current;
    const buttons = buttonsRef.current;
    
    if (title) {
      title.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        title.classList.remove('opacity-0', 'translate-y-4');
        title.classList.add('transition-all', 'duration-700', 'opacity-100', 'translate-y-0');
      }, 300);
    }
    
    if (description) {
      description.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        description.classList.remove('opacity-0', 'translate-y-4');
        description.classList.add('transition-all', 'duration-700', 'opacity-100', 'translate-y-0');
      }, 500);
    }
    
    if (buttons) {
      buttons.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        buttons.classList.remove('opacity-0', 'translate-y-4');
        buttons.classList.add('transition-all', 'duration-700', 'opacity-100', 'translate-y-0');
      }, 700);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background overlay image */}
      <div className="absolute inset-0 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 animate-fade-in"
          style={{ 
            backgroundImage: "url('/lovable-uploads/c7d648dd-1798-48a5-ac06-eb45e82497be.png')",
            backgroundPosition: "center 25%" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-flyerflix-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-flyerflix-black via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="flyerflix-container relative z-10">
        <div className="max-w-xl py-20">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          >
            Templates profissionais para revolucionar seus eventos
          </h1>
          <p 
            ref={descRef}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Acesso ilimitado a centenas de templates de alta qualidade para flyers, 
            cartazes e posts. Crie materiais impactantes em minutos.
          </p>
          <div 
            ref={buttonsRef}
            className="flex flex-wrap gap-4"
          >
            <Button 
              className="flyerflix-btn-primary text-base hover:scale-110 transition-transform duration-300 animate-pulse-slow" 
              asChild
            >
              <Link to="/register">
                Experimente grátis
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-base hover:scale-105 transition-all duration-300" 
              asChild
            >
              <a href="#pricing">
                Saiba mais
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

