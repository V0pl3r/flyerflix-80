
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type ProfileType = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: ProfileType | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      }
    );

    // Initial session check
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    initSession();
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setIsAdmin(data.role === 'admin' || data.role === 'super_admin');
      setIsSuperAdmin(data.role === 'super_admin');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        await fetchUserProfile(data.user.id);
        
        // Redirect admins to admin dashboard, regular users to main dashboard
        if (isAdmin) {
          navigate('/admin');
          toast.success('Bem-vindo ao painel de administração!');
        } else {
          navigate('/dashboard');
          toast.success('Login realizado com sucesso!');
        }
      }
    } catch (error: any) {
      toast.error('Erro ao fazer login', {
        description: error.message || 'Verifique suas credenciais e tente novamente.',
      });
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao fazer logout', {
        description: error.message,
      });
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    isSuperAdmin,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
