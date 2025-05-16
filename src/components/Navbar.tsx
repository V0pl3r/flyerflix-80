
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('flyerflix-user');
    setIsLoggedIn(!!user);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-flyerflix-black/95 shadow-md backdrop-blur-md' : 'bg-flyerflix-black/90 backdrop-blur-sm'} animate-slide-in-down`}>
      <div className="flyerflix-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-flyerflix-red text-3xl font-bold transition-transform duration-300 hover:scale-105">FLYERFLIX</Link>
          </div>
          
          {/* Right Side Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 animate-fade-in">
            <Link to="/login">
              <Button className="flyerflix-btn-secondary btn-hover-effect" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="flyerflix-btn-primary btn-hover-effect" size="sm">
                Registrar-se
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center animate-fade-in">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-1 transition-transform active:scale-90"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 border-t border-white/10 mt-4 animate-fade-in">
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login" className="w-full">
                <Button className="flyerflix-btn-secondary w-full btn-hover-effect">
                  Entrar
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="flyerflix-btn-primary w-full btn-hover-effect">
                  Registrar-se
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
