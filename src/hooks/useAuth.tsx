
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
import { getUserProfile, createUserProfile, updateUserProfile, UserProfile } from '@/models/UserProfile';

type UserType = {
  id: string;
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | "unlimited";
  favorites: string[];
  avatarUrl?: string;
};

interface AuthContextType {
  user: UserType | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<UserType>) => void;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<string | null>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  addFavorite: (templateId: string) => Promise<void>;
  removeFavorite: (templateId: string) => Promise<void>;
  recordDownload: (templateId: string, templateName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load user profile from Supabase and update state
  const loadUserProfile = async (userId: string, email: string) => {
    setLoading(true);
    try {
      // Try to get existing profile
      let userProfile = await getUserProfile(userId);
      
      // If no profile exists, create one
      if (!userProfile) {
        userProfile = await createUserProfile(userId, email);
      }
      
      if (userProfile) {
        setProfile(userProfile);
        
        // Map profile data to user state object
        setUser({
          id: userId,
          name: userProfile.name || 'Usuário Flyerflix',
          email: email,
          plan: userProfile.plan,
          downloads: userProfile.downloads_today,
          maxDownloads: userProfile.plan === 'ultimate' ? "unlimited" : 2,
          favorites: userProfile.favorites || [],
          avatarUrl: userProfile.avatar_url
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Load user profile data
          await loadUserProfile(session.user.id, session.user.email || '');
          
          // Check subscription status
          await checkSubscription();
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id, session.user.email || '');
          await checkSubscription();
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );
    
    // Initial check
    checkAuth();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
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
        
        // Also update the profile in Supabase if plan changed
        if (profile && profile.plan !== data.plan) {
          const updatedProfile = await updateUserProfile(user.id, {
            plan: data.plan === 'ultimate' ? 'ultimate' : 'free'
          });
          
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a checkout session for subscription with specific price
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à Flyerflix.",
        });
        
        navigate('/dashboard');
      }
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
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile for the new user
      if (data.user) {
        await createUserProfile(data.user.id, email, name);
        
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
      setUser(updatedUser);
    }
  };
  
  // Update user avatar URL
  const updateUserAvatar = async (avatarUrl: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Update profile in Supabase
      const updatedProfile = await updateUserProfile(user.id, {
        avatar_url: avatarUrl
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        updateUser({ avatarUrl });
        
        toast({
          title: "Imagem atualizada",
          description: "Seu avatar foi atualizado com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível salvar sua imagem.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add template to favorites
  const addFavorite = async (templateId: string) => {
    if (!user?.id || !profile) return;
    
    // Optimistic update
    setUser({
      ...user,
      favorites: [...user.favorites, templateId]
    });
    
    try {
      // Update profile in Supabase
      const updatedFavorites = [...(profile.favorites || []), templateId];
      const updatedProfile = await updateUserProfile(user.id, {
        favorites: updatedFavorites
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      // Revert optimistic update on failure
      setUser({
        ...user,
        favorites: user.favorites.filter(id => id !== templateId)
      });
      
      console.error("Error adding favorite:", error);
    }
  };
  
  // Remove template from favorites
  const removeFavorite = async (templateId: string) => {
    if (!user?.id || !profile) return;
    
    // Optimistic update
    setUser({
      ...user,
      favorites: user.favorites.filter(id => id !== templateId)
    });
    
    try {
      // Update profile in Supabase
      const updatedFavorites = (profile.favorites || []).filter(id => id !== templateId);
      const updatedProfile = await updateUserProfile(user.id, {
        favorites: updatedFavorites
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      // Revert optimistic update on failure
      setUser({
        ...user,
        favorites: [...user.favorites, templateId]
      });
      
      console.error("Error removing favorite:", error);
    }
  };
  
  // Record template download
  const recordDownload = async (templateId: string, templateName: string): Promise<boolean> => {
    if (!user?.id || !profile) return false;
    
    try {
      // Update user state optimistically
      const newDownloadsCount = user.downloads + 1;
      updateUser({
        downloads: newDownloadsCount
      });
      
      // Record download in Supabase
      const currentDate = new Date().toISOString();
      const newDownload = {
        template_id: templateId,
        template_name: templateName,
        downloaded_at: currentDate
      };
      
      const today = currentDate.split('T')[0]; // YYYY-MM-DD
      const lastDownloadDate = profile.last_download_date?.split('T')[0];
      
      // Reset daily counter if it's a new day
      let downloadsToday = profile.downloads_today || 0;
      if (lastDownloadDate !== today) {
        downloadsToday = 0;
      }
      
      // Update profile in Supabase
      const updatedProfile = await updateUserProfile(user.id, {
        downloads_today: downloadsToday + 1,
        last_download_date: currentDate,
        download_history: [...(profile.download_history || []), newDownload]
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error recording download:", error);
      // Revert optimistic update
      updateUser({
        downloads: Math.max(0, user.downloads - 1)
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        loading, 
        login, 
        logout, 
        register, 
        updateUser,
        checkSubscription,
        createCheckoutSession,
        updateUserAvatar,
        addFavorite,
        removeFavorite,
        recordDownload
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
