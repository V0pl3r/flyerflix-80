import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { fetchUserProfile } from '@/models/UserProfile';

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

  // Nova função auxiliar para buscar e montar o ExtendedUser atualizado do Supabase
  const loadProfileFromSupabase = async (userId: string, sessionUser: User): Promise<ExtendedUser> => {
    const dbProfile = await fetchUserProfile(userId);

    if (dbProfile) {
      // Ensure plan is properly typed - default to 'free' if invalid
      const validPlan: 'free' | 'ultimate' = dbProfile.plan === 'ultimate' ? 'ultimate' : 'free';
      
      return {
        ...sessionUser,
        name: dbProfile.name || sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0],
        plan: validPlan,
        avatarUrl: dbProfile.avatar_url || sessionUser.user_metadata?.avatar_url,
        email: dbProfile.email || sessionUser.email,
      };
    } else {
      // fallback: só dados do Supabase Auth
      return {
        ...sessionUser,
        name: sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0],
        plan: 'free' as const,
        avatarUrl: sessionUser.user_metadata?.avatar_url,
        email: sessionUser.email,
      };
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (session?.user) {
          // Busca perfil do Supabase na mudança de auth (async via setTimeout)
          setLoading(true);
          setTimeout(async () => {
            const extendedUser = await loadProfileFromSupabase(session.user.id, session.user);

            setUser(extendedUser);
            // Persiste também no localStorage
            localStorage.setItem('flyerflix-user', JSON.stringify({
              ...extendedUser,
              id: session.user.id,
              email: session.user.email
            }));
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('flyerflix-user');
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        setLoading(true);
        const extendedUser = await loadProfileFromSupabase(session.user.id, session.user);

        setUser(extendedUser);
        localStorage.setItem('flyerflix-user', JSON.stringify({
          ...extendedUser,
          id: session.user.id,
          email: session.user.email
        }));
        setLoading(false);
      } else {
        setLoading(false);
      }
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

  const updateUser = (userData: Partial<ExtendedUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
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
