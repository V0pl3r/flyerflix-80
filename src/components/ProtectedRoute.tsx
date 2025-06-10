
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-flyerflix-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-flyerflix-red text-3xl font-bold mb-4">FLYERFLIX</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flyerflix-red mx-auto"></div>
          <p className="text-white/60 mt-4">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
