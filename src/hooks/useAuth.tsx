
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
import { fetchUserProfile } from '@/models/UserProfile';

type UserType = {
  id: string;
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | "unlimited";
  avatarUrl?: string;
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
  
  // Load user from localStorage and Supabase on auth change
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          // Use setTimeout to defer the Supabase profile fetch to prevent auth deadlock
          setTimeout(async () => {
            await loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const loadInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading initial session:', error);
        setLoading(false);
      }
    };
    
    loadInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Load user profile data from Supabase
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for ID:', userId);
      // Try to fetch from Supabase first
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        console.log('Profile found in Supabase:', profile);
        // Convert profile data to UserType
        const userData: UserType = {
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          plan: profile.plan || 'free',
          downloads: profile.downloads_today || 0,
          maxDownloads: profile.plan === 'ultimate' ? 'unlimited' : 2,
          avatarUrl: profile.avatar_url || '',
        };
        
        setUser(userData);
        localStorage.setItem('flyerflix-user', JSON.stringify(userData));
        console.log('User data saved to localStorage');
      } else {
        console.log('Profile not found in Supabase, checking localStorage');
        // Fallback to localStorage if Supabase fetch fails
        const storedUser = localStorage.getItem('flyerflix-user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Ensure ID is set
            parsedUser.id = userId;
            setUser(parsedUser);
            console.log('User loaded from localStorage:', parsedUser);
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('flyerflix-user');
            createDefaultUser(userId);
          }
        } else {
          console.log('No user in localStorage, creating default user');
          createDefaultUser(userId);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      createDefaultUser(userId);
    } finally {
      setLoading(false);
    }
  };
  
  const createDefaultUser = (userId: string) => {
    // Create a default user object if none exists
    const defaultUser: UserType = {
      id: userId,
      name: '',
      email: '',
      plan: 'free',
      downloads: 0,
      maxDownloads: 2
    };
    setUser(defaultUser);
    localStorage.setItem('flyerflix-user', JSON.stringify(defaultUser));
    console.log('Created default user:', defaultUser);
  };
  
  // Check subscription status from Stripe
  const checkSubscription = async () => {
    if (!user?.id) return;
    
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
      console.log("Creating checkout session for user:", user.id);
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error("Checkout error:", error);
        toast({
          title: "Erro ao criar sessão de pagamento",
          description: error.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return null;
      }
      
      console.log("Checkout session created:", data);
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível iniciar o processo de upgrade.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        
        // Get user email
        const userEmail = data.user.email;
        
        // Check if user is admin
        const isAdmin = userEmail === 'admin@flyerflix.com' || userEmail === 'diego@lovelystudio.com';
        
        // User profile will be loaded by the auth state change listener
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à Flyerflix.",
        });
        
        if (isAdmin) {
          console.log('Admin user detected, redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('Regular user, redirecting to dashboard');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
      console.log('Logging out current user');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      console.log('Logout successful');
      localStorage.removeItem('flyerflix-welcome-seen');
      localStorage.removeItem('flyerflix-visited-dashboard');
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
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
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // User profile will be loaded by the auth state change listener
        toast({
          title: "Registro realizado com sucesso!",
          description: "Bem-vindo à Flyerflix.",
        });
        
        navigate('/dashboard');
      }
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
