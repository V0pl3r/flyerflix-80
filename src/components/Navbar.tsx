
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      // Admin has specific email to identify them
      if (adminEmail !== 'admin@flyerflix.com') {
        throw new Error('Email de administrador não reconhecido');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      
      if (error) throw error;
      
      // Verify if user is admin in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();
      
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
          {/* Logo with hidden admin trigger */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-flyerflix-red text-3xl font-bold transition-transform duration-300 hover:scale-105"
              onClick={handleLogoClick}
            >
              FLYERFLIX
            </Link>
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
      
      {/* Hidden Admin Login Dialog */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock size={16} /> Login Administrativo
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Acesse o painel de administração da Flyerflix
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input 
                id="admin-email" 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="bg-[#2a2a2a] border-white/10"
                placeholder="admin@flyerflix.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input 
                id="admin-password" 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-[#2a2a2a] border-white/10"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAdminLogin(false)} 
              className="border-white/20 hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAdminLogin}
              className="bg-flyerflix-red hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
