import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { fetchUserProfile, updateUserProfile } from '@/models/UserProfile';

// Extended user interface with custom properties
interface ExtendedUser extends User {
  name?: string;
  plan?: 'free' | 'ultimate';
  avatarUrl?: string;
  downloads?: number;
  maxDownloads?: number | 'unlimited';
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  createCheckoutSession: () => Promise<string | null>;
  checkSubscription: () => Promise<void>;
  updateUser: (userData: Partial<ExtendedUser>) => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string, authUser: User) => {
    try {
      console.log('Loading user profile for:', userId);
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        console.log('Profile found:', profile);
        const extendedUser: ExtendedUser = {
          ...authUser,
          name: profile.name || profile.first_name || authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          plan: profile.plan as 'free' | 'ultimate' || 'free',
          avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url,
          downloads: profile.downloads_today || 0,
          maxDownloads: profile.plan === 'ultimate' ? 'unlimited' : 2
        };
        
        setUser(extendedUser);
        
        // Update localStorage with the complete user data
        localStorage.setItem('flyerflix-user', JSON.stringify({
          ...extendedUser,
          id: authUser.id,
          email: authUser.email
        }));
      } else {
        console.log('No profile found, creating default user');
        // Create default user if no profile exists
        const defaultUser: ExtendedUser = {
          ...authUser,
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          plan: 'free',
          avatarUrl: authUser.user_metadata?.avatar_url,
          downloads: 0,
          maxDownloads: 2
        };
        
        setUser(defaultUser);
        
        // Try to create profile in database
        await updateUserProfile({
          id: authUser.id,
          email: authUser.email,
          name: defaultUser.name,
          plan: 'free',
          avatar_url: defaultUser.avatarUrl,
          downloads_today: 0
        });
        
        localStorage.setItem('flyerflix-user', JSON.stringify({
          ...defaultUser,
          id: authUser.id,
          email: authUser.email
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to basic user data
      const fallbackUser: ExtendedUser = {
        ...authUser,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
        plan: 'free',
        avatarUrl: authUser.user_metadata?.avatar_url,
        downloads: 0,
        maxDownloads: 2
      };
      
      setUser(fallbackUser);
      localStorage.setItem('flyerflix-user', JSON.stringify({
        ...fallbackUser,
        id: authUser.id,
        email: authUser.email
      }));
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Load complete user profile from database
          await loadUserProfile(session.user.id, session.user);
        } else {
          setUser(null);
          localStorage.removeItem('flyerflix-user');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Erro ao fazer login: ' + error.message);
        return { error };
      }
      
      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Error during login:', error);
      toast.error('Erro inesperado durante o login');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('flyerflix-user');
      setUser(null);
      setSession(null);
      
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout: ' + error.message);
    }
  };

  const updateUser = async (userData: Partial<ExtendedUser>) => {
    if (user && session) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
      
      // Update profile in database
      try {
        await updateUserProfile({
          id: session.user.id,
          name: updatedUser.name,
          avatar_url: updatedUser.avatarUrl,
          plan: updatedUser.plan,
          downloads_today: updatedUser.downloads,
          email: updatedUser.email
        });
      } catch (error) {
        console.error('Error updating user profile in database:', error);
      }
    }
  };

  const isAdmin = () => {
    // Check if user is admin based on email or metadata
    return user?.email === 'admin@flyerflix.com' || user?.user_metadata?.role === 'admin';
  };

  const createCheckoutSession = async (): Promise<string | null> => {
    try {
      if (!session) {
        toast.error('Você precisa estar logado para fazer upgrade');
        return null;
      }

      toast.loading('Criando sessão de checkout...', { duration: 2000 });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Erro ao criar sessão de checkout: ' + error.message);
        return null;
      }

      if (data.url) {
        toast.success('Redirecionando para o checkout...');
        return data.url;
      } else {
        toast.error('URL de checkout não foi retornada');
        return null;
      }
    } catch (error: any) {
      console.error('Error in createCheckoutSession:', error);
      toast.error('Erro inesperado: ' + error.message);
      return null;
    }
  };

  const checkSubscription = async () => {
    try {
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      console.log('Subscription check result:', data);
      
      // Update user plan based on subscription status
      if (data.isActive && user) {
        updateUser({ plan: 'ultimate' });
      }
    } catch (error: any) {
      console.error('Error in checkSubscription:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    logout,
    login,
    createCheckoutSession,
    checkSubscription,
    updateUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
