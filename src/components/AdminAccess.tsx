
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Admin credentials - would be better stored securely, but for now they are hardcoded
// In a production environment, these would be validated against a database
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "flyerflix2025";

const AdminAccess = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Click counter for secret admin access
  const [clickCount, setClickCount] = useState(0);
  const handleSecretClick = () => {
    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount >= 5) {
        setShowLogin(true);
        return 0;
      }
      return newCount;
    });
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple timeout to simulate validation
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store admin session in localStorage
        localStorage.setItem('flyerflix-admin', 'true');
        
        // Show success toast
        toast({
          title: "Login de administrador bem-sucedido",
          description: "Bem-vindo ao painel administrativo.",
        });
        
        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        toast({
          title: "Acesso negado",
          description: "Credenciais de administrador inválidas.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
      setUsername('');
      setPassword('');
    }, 1000);
  };
  
  return (
    <>
      {/* Hidden trigger for admin access */}
      <div 
        className="w-2 h-2 rounded-full bg-transparent cursor-default"
        onClick={handleSecretClick}
        aria-hidden="true"
      />
      
      {/* Admin login modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-flyerflix-black border border-white/10 p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in-up relative">
            <button 
              className="absolute top-3 right-3 text-white/70 hover:text-white"
              onClick={() => setShowLogin(false)}
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-flyerflix-red" />
              <h2 className="text-xl font-bold text-white">Acesso Administrativo</h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-white/70">
                  Usuário
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/50 border-gray-700/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/70">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-700/50"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-flyerflix-red hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Acessar'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAccess;
