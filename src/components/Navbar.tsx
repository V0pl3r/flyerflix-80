import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLoginDialog from './AdminLoginDialog';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoClickCounter, setLogoClickCounter] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  // Logo click counter for hidden admin trigger
  useEffect(() => {
    if (logoClickCounter >= 3) {
      setShowAdminLogin(true);
      setLogoClickCounter(0);
    }
    
    // Reset counter if no clicks for 2 seconds
    const timeout = setTimeout(() => {
      if (logoClickCounter > 0 && logoClickCounter < 3) {
        setLogoClickCounter(0);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [logoClickCounter]);
  
  // Admin login handler
  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      // Permitir múltiplos emails de admin
      const allowedAdminEmails = ['admin@flyerflix.com', 'foxdesignpb@gmail.com'];
      // Normaliza para minúsculas e remove espaços
      const normalizedInputEmail = adminEmail.trim().toLowerCase();
      const isAllowed = allowedAdminEmails.some(email => email.trim().toLowerCase() === normalizedInputEmail);
      if (!isAllowed) {
        throw new Error('Email de administrador não reconhecido');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      
      if (error) throw error;
      
      // Verifica se é admin mesmo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError || !profileData || !profileData.is_admin) {
        throw new Error('Acesso administrativo não autorizado');
      }
      
      toast({
        title: "Login de administrador bem-sucedido",
        description: "Redirecionando para o painel administrativo."
      });
      
      // Store admin status in localStorage
      const userObj = JSON.parse(localStorage.getItem('flyerflix-user') || '{}');
      localStorage.setItem('flyerflix-user', JSON.stringify({
        ...userObj,
        isAdmin: true
      }));
      
      setShowAdminLogin(false);
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro no login de administrador",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hidden admin trigger - triple click on logo
  const handleLogoClick = () => {
    setLogoClickCounter(prev => prev + 1);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-flyerflix-black/95 shadow-md backdrop-blur-md' : 'bg-flyerflix-black/90 backdrop-blur-sm'} animate-slide-in-down`}>
      <div className="flyerflix-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo com trigger oculto para admin */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-flyerflix-red text-3xl font-bold transition-transform duration-300 hover:scale-105"
              onClick={handleLogoClick}
            >
              FLYERFLIX
            </Link>
          </div>
          {/* Menu lado direito (desktop) */}
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
          {/* Botão menu mobile */}
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
        {/* Menu mobile */}
        <MobileMenu isOpen={isMenuOpen} />
      </div>
      {/* Diálogo de login admin */}
      <AdminLoginDialog
        open={showAdminLogin}
        isLoading={isLoading}
        adminEmail={adminEmail}
        adminPassword={adminPassword}
        onOpenChange={setShowAdminLogin}
        onEmailChange={setAdminEmail}
        onPasswordChange={setAdminPassword}
        onLogin={handleAdminLogin}
      />
    </nav>
  );
};

export default Navbar;
