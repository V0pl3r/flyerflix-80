
import { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-flyerflix-black/90 backdrop-blur-md">
      <div className="flyerflix-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-flyerflix-red text-3xl font-bold mr-10">FLYERFLIX</a>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-flyerflix-red transition">Home</a>
              <a href="#" className="text-white hover:text-flyerflix-red transition">Categorias</a>
              <a href="#" className="text-white hover:text-flyerflix-red transition">Novidades</a>
              <a href="#" className="text-white hover:text-flyerflix-red transition">Meus Favoritos</a>
            </div>
          </div>
          
          {/* Right Side Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar templates..." 
                className="bg-black/30 border border-white/20 text-white rounded px-4 py-1.5 w-48 focus:w-64 transition-all duration-300 focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            </div>
            <Button className="flyerflix-btn-secondary" size="sm">
              <User size={16} className="mr-2" />
              Entrar
            </Button>
            <Button className="flyerflix-btn-primary" size="sm">
              Assinar
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 border-t border-white/10 mt-4">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Buscar templates..." 
                className="bg-black/30 border border-white/20 text-white rounded px-4 py-2 w-full focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            </div>
            <a href="#" className="block text-white py-2">Home</a>
            <a href="#" className="block text-white py-2">Categorias</a>
            <a href="#" className="block text-white py-2">Novidades</a>
            <a href="#" className="block text-white py-2">Meus Favoritos</a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button className="flyerflix-btn-secondary w-full">
                <User size={16} className="mr-2" />
                Entrar
              </Button>
              <Button className="flyerflix-btn-primary w-full">
                Assinar
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
