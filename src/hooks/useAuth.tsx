import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// Extended user interface with custom properties
interface ExtendedUser extends User {
  name?: string;
  plan?: 'free' | 'ultimate';
  avatarUrl?: string;
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Create extended user with default properties
          const extendedUser: ExtendedUser = {
            ...session.user,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            plan: 'free', // Default plan
            avatarUrl: session.user.user_metadata?.avatar_url
          };
          setUser(extendedUser);
          
          // Store user data in localStorage with user ID prefix
          const userKey = `flyerflix-user-${session.user.id}`;
          localStorage.setItem(userKey, JSON.stringify({
            ...extendedUser,
            id: session.user.id,
            email: session.user.email
          }));
          
          // Set current user ID for data isolation
          localStorage.setItem('flyerflix-current-user', session.user.id);
        } else {
          setUser(null);
          // Clear current user and all user-specific data
          const currentUserId = localStorage.getItem('flyerflix-current-user');
          if (currentUserId) {
            // Clear user-specific data
            localStorage.removeItem(`flyerflix-user-${currentUserId}`);
            localStorage.removeItem(`flyerflix-history-${currentUserId}`);
            localStorage.removeItem(`flyerflix-favorites-${currentUserId}`);
            localStorage.removeItem(`flyerflix-downloads-${currentUserId}`);
            localStorage.removeItem(`flyerflix-welcome-seen-${currentUserId}`);
            localStorage.removeItem(`flyerflix-visited-dashboard-${currentUserId}`);
          }
          localStorage.removeItem('flyerflix-current-user');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          plan: 'free',
          avatarUrl: session.user.user_metadata?.avatar_url
        };
        setUser(extendedUser);
        
        const userKey = `flyerflix-user-${session.user.id}`;
        localStorage.setItem(userKey, JSON.stringify({
          ...extendedUser,
          id: session.user.id,
          email: session.user.email
        }));
        
        localStorage.setItem('flyerflix-current-user', session.user.id);
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
        toast.error('Erro ao fazer login: ' + error.message);
        return { error };
      }
      
      toast.success('Login realizado com sucesso!');
      
      // Auto-redirect after successful login
      setTimeout(() => {
        // Check if user is admin and redirect accordingly
        if (email === 'admin@flyerflix.com') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1000);
      
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
      
      // Clear all user data will be handled by the auth state change
      setUser(null);
      setSession(null);
      
      toast.success('Logout realizado com sucesso!');
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout: ' + error.message);
    }
  };

  const updateUser = (userData: Partial<ExtendedUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      const userKey = `flyerflix-user-${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
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

export default AuthProvider;
