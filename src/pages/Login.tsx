import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Animate elements on mount
    const logo = logoRef.current;
    const form = formRef.current;
    
    if (logo) {
      logo.classList.add('opacity-0', 'scale-90');
      setTimeout(() => {
        logo.classList.remove('opacity-0', 'scale-90');
        logo.classList.add('transition-all', 'duration-700', 'opacity-100', 'scale-100');
      }, 100);
    }
    
    if (form) {
      form.classList.add('opacity-0', 'translate-y-10');
      setTimeout(() => {
        form.classList.remove('opacity-0', 'translate-y-10');
        form.classList.add('transition-all', 'duration-500', 'opacity-100', 'translate-y-0');
      }, 400);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      // Check if using admin credentials
      const isAdminLogin = email === 'admin@flyerflix.com';
      
      if (isAdminLogin) {
        console.log('Attempting admin login...');
      }
      
      const { error } = await login(email, password);
      
      if (error) {
        setLoginError(error.message || 'Falha no login. Por favor, tente novamente.');
        toast({
          title: "Erro no login",
          description: error.message || "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      }
      // Redirect is handled automatically by useAuth hook
    } catch (error: any) {
      console.error('Login error in component:', error);
      setLoginError(error.message || 'Falha no login. Por favor, tente novamente.');
      
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Helper function for quick admin login in dev mode
  const fillAdminCredentials = () => {
    if (process.env.NODE_ENV === 'development') {
      setEmail('admin@flyerflix.com');
      setPassword('admin123@');
    }
  };

  return (
    <div className="min-h-screen bg-flyerflix-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <div 
        ref={logoRef} 
        className="mb-10"
      >
        <Link to="/">
          <h1 className="text-flyerflix-red text-4xl font-bold hover:scale-105 transition-all duration-300">FLYERFLIX</h1>
        </Link>
      </div>
      
      <div 
        ref={formRef}
        className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-lg shadow-lg border border-white/10 animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-white mb-6" onClick={fillAdminCredentials}>Entrar</h2>
        
        {loginError && (
          <div className="bg-red-900/30 border border-red-500/50 text-white px-4 py-3 rounded mb-4">
            <p className="text-sm">{loginError}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-[#333] border-[#444] text-white animated-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/70">
                Senha
              </label>
              <Link to="/recuperar-senha" className="text-xs text-white/70 hover:text-flyerflix-red transition-all duration-200">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-[#333] border-[#444] text-white pr-10 animated-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-flyerflix-red hover:bg-red-700 transition-all duration-300 hover:shadow-lg active:scale-98 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/70">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-flyerflix-red hover:underline transition-all duration-200">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
