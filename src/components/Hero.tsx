
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background overlay image */}
      <div className="absolute inset-0 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80')",
            backgroundPosition: "center 25%" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-flyerflix-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-flyerflix-black via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="flyerflix-container relative z-10">
        <div className="max-w-xl py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Templates profissionais para revolucionar seus eventos
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Acesso ilimitado a centenas de templates de alta qualidade para flyers, 
            cartazes e posts. Crie materiais impactantes em minutos.
          </p>
          <div className="flex flex-wrap gap-4">
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
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-base" 
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
