
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('flyerflix-user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-flyerflix-black/90 backdrop-blur-md">
      <div className="flyerflix-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-flyerflix-red text-3xl font-bold">FLYERFLIX</Link>
          </div>
          
          {/* Right Side Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button className="flyerflix-btn-secondary" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="flyerflix-btn-primary hover:scale-105 transition-transform duration-200" size="sm">
                Registrar-se
              </Button>
            </Link>
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
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login" className="w-full">
                <Button className="flyerflix-btn-secondary w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="flyerflix-btn-primary w-full hover:scale-105 transition-transform duration-200">
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
