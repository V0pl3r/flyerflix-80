
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  logout: () => Promise<void>;
  createCheckoutSession: () => Promise<string | null>;
  checkSubscription: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Store user data in localStorage for persistence
        if (session?.user) {
          localStorage.setItem('flyerflix-user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name
          }));
        } else {
          localStorage.removeItem('flyerflix-user');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        localStorage.setItem('flyerflix-user', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    } catch (error: any) {
      console.error('Error in checkSubscription:', error);
    }
  };

  const value = {
    user,
    session,
    logout,
    createCheckoutSession,
    checkSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
