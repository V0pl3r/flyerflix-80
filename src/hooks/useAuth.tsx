
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | "unlimited";
};

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<UserType>) => void;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('flyerflix-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('flyerflix-user');
      }
    }
    setLoading(false);
  }, []);
  
  // Check subscription status from Stripe
  const checkSubscription = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      if (data) {
        // Update the user object with the subscription details
        updateUser({
          plan: data.plan,
          maxDownloads: data.maxDownloads,
        });
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a checkout session for subscription
  const createCheckoutSession = async (): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upgrade.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        toast({
          title: "Erro ao criar sessão de pagamento",
          description: error.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return null;
      }
      
      return data.url;
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível iniciar o processo de upgrade.",
        variant: "destructive",
      });
      console.error('Error creating checkout session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // This is a mock login - would be replaced with Supabase auth
      // Simulate successful login
      const mockUser: UserType = { 
        name: 'Usuário Teste', 
        email: email, 
        plan: 'free',
        downloads: 0,
        maxDownloads: 2
      };
      
      localStorage.setItem('flyerflix-user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Flyerflix.",
      });
      
      navigate('/dashboard');
      
      // Check if user has an active subscription
      await checkSubscription();
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('flyerflix-user');
      localStorage.removeItem('flyerflix-welcome-seen');
      localStorage.removeItem('flyerflix-visited-dashboard');
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // This is a mock registration - would be replaced with actual authentication
      const mockUser: UserType = { 
        name: name, 
        email: email, 
        plan: 'free',
        downloads: 0,
        maxDownloads: 2
      };
      
      localStorage.setItem('flyerflix-user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Registro realizado com sucesso!",
        description: "Bem-vindo à Flyerflix.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Tente novamente com informações diferentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = (data: Partial<UserType>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        register, 
        updateUser,
        checkSubscription,
        createCheckoutSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
