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
  refreshUserProfile: () => Promise<void>;
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

  const refreshUserProfile = async () => {
    if (!session?.user) return;
    
    try {
      let userProfile = await fetchUserProfile(session.user.id);
      
      // Se o perfil não existir no Supabase, criar um
      if (!userProfile) {
        const newProfile = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || 
                session.user.user_metadata?.full_name || 
                session.user.email?.split('@')[0] || '',
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          avatar_url: session.user.user_metadata?.avatar_url,
          plan: 'free' as const, // Explicitly type as 'free'
          role: 'user' as const,
          is_admin: false,
          user_id: session.user.id
        };
        
        userProfile = await updateUserProfile(newProfile);
      }
      
      if (userProfile) {
        // Atualizar o usuário com dados do perfil
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: userProfile.name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
          plan: (userProfile.plan === 'ultimate' ? 'ultimate' : 'free') as 'free' | 'ultimate',
          avatarUrl: userProfile.avatar_url || session.user.user_metadata?.avatar_url
        };
        
        setUser(extendedUser);
        
        // Armazenar no localStorage
        localStorage.setItem('flyerflix-user', JSON.stringify({
          ...extendedUser,
          id: session.user.id,
          email: session.user.email
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Carregar o perfil do Supabase em background
          setTimeout(() => {
            refreshUserProfile();
          }, 0);
          
          // Criar usuário temporário até o perfil carregar
          const tempUser: ExtendedUser = {
            ...session.user,
            name: session.user.user_metadata?.name || 
                  session.user.user_metadata?.full_name || 
                  session.user.email?.split('@')[0] || '',
            plan: 'free',
            avatarUrl: session.user.user_metadata?.avatar_url
          };
          setUser(tempUser);
        } else {
          setUser(null);
          localStorage.removeItem('flyerflix-user');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        // Carregar o perfil do Supabase
        setTimeout(() => {
          refreshUserProfile();
        }, 0);
        
        // Criar usuário temporário
        const tempUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || 
                session.user.user_metadata?.full_name || 
                session.user.email?.split('@')[0] || '',
          plan: 'free',
          avatarUrl: session.user.user_metadata?.avatar_url
        };
        setUser(tempUser);
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
      // Verificar se há uma sessão ativa antes de tentar fazer logout
      if (!session) {
        console.log('No active session to logout from');
        // Limpar dados locais mesmo sem sessão ativa
        localStorage.removeItem('flyerflix-user');
        setUser(null);
        setSession(null);
        toast.success('Logout realizado com sucesso!');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      localStorage.removeItem('flyerflix-user');
      setUser(null);
      setSession(null);
      
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Error during logout:', error);
      
      // Mesmo com erro, limpar dados locais para evitar estado inconsistente
      localStorage.removeItem('flyerflix-user');
      setUser(null);
      setSession(null);
      
      toast.error('Erro ao fazer logout, mas você foi desconectado localmente');
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
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
