
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This is a mock login - would be replaced with actual authentication
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem('flyerflix-user', JSON.stringify({ 
        name: 'Usuário Teste', 
        email: email, 
        plan: 'free',
        downloads: 0,
        maxDownloads: 2
      }));
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Flyerflix.",
      });
      
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-flyerflix-black flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-10">
        <h1 className="text-flyerflix-red text-4xl font-bold">FLYERFLIX</h1>
      </Link>
      
      <div className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-lg shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Entrar</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-[#333] border-[#444] text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/70">
                Senha
              </label>
              <Link to="/recuperar-senha" className="text-xs text-white/70 hover:text-flyerflix-red transition">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-[#333] border-[#444] text-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-flyerflix-red hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/70">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-flyerflix-red hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
