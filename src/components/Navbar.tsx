
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('flyerflix-user');
    setIsLoggedIn(!!user);
  }, []);
  
  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-flyerflix-black/90 backdrop-blur-md">
      <div className="flyerflix-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-flyerflix-red text-3xl font-bold mr-10">FLYERFLIX</Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-white hover:text-flyerflix-red transition">Home</Link>
              <a href="#" className="text-white hover:text-flyerflix-red transition">Categorias</a>
              <a href="#" className="text-white hover:text-flyerflix-red transition">Novidades</a>
              {isLoggedIn && (
                <Link to="/dashboard" className="text-white hover:text-flyerflix-red transition">Meus Favoritos</Link>
              )}
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
            <Button 
              className="flyerflix-btn-secondary" 
              size="sm"
              onClick={handleLoginClick}
            >
              <User size={16} className="mr-2" />
              {isLoggedIn ? 'Minha Conta' : 'Entrar'}
            </Button>
            {!isLoggedIn && (
              <Link to="/register">
                <Button className="flyerflix-btn-primary" size="sm">
                  Assinar
                </Button>
              </Link>
            )}
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
            <Link to="/" className="block text-white py-2">Home</Link>
            <a href="#" className="block text-white py-2">Categorias</a>
            <a href="#" className="block text-white py-2">Novidades</a>
            {isLoggedIn && (
              <Link to="/dashboard" className="block text-white py-2">Meus Favoritos</Link>
            )}
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                className="flyerflix-btn-secondary w-full"
                onClick={handleLoginClick}
              >
                <User size={16} className="mr-2" />
                {isLoggedIn ? 'Minha Conta' : 'Entrar'}
              </Button>
              {!isLoggedIn && (
                <Link to="/register" className="w-full">
                  <Button className="flyerflix-btn-primary w-full">
                    Assinar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
