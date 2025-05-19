
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { user, loading, isAdmin } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // After auth hook is done loading, allow a brief delay to check admin status
    if (!loading) {
      const timer = setTimeout(() => {
        setChecking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Show loading indicator while checking admin status
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-flyerflix-red text-3xl font-bold mb-8">FLYERFLIX ADMIN</h1>
          <div className="space-y-4">
            <Skeleton className="w-full h-8 bg-white/5" />
            <Skeleton className="w-3/4 h-8 bg-white/5" />
            <Skeleton className="w-2/3 h-8 bg-white/5" />
          </div>
          <p className="text-white/60 mt-8">Verificando credenciais...</p>
        </div>
      </div>
    );
  }
  
  // If not admin, redirect to home page
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  // If admin, render the admin routes
  return <>{children}</>;
};

export default AdminRouteGuard;
