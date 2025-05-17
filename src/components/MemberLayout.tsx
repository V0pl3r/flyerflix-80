
import { useState, useEffect, ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import MemberSidebar from './MemberSidebar';
import WelcomeModal from './WelcomeModal';
import { useAuth } from '@/hooks/useAuth';

interface MemberLayoutProps {
  children?: ReactNode;
}

const MemberLayout = ({ children }: MemberLayoutProps) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('flyerflix-visited-dashboard');
    const hasSeenWelcome = localStorage.getItem('flyerflix-welcome-seen');
    
    if (!hasVisited) {
      localStorage.setItem('flyerflix-visited-dashboard', 'true');
      
      if (!hasSeenWelcome) {
        setTimeout(() => {
          setShowWelcome(true);
        }, 1500);
      }
    }
  }, []);
  
  const handleCloseWelcome = () => {
    localStorage.setItem('flyerflix-welcome-seen', 'true');
    setShowWelcome(false);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="h-screen w-screen bg-flyerflix-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="text-flyerflix-red text-3xl font-bold mb-4">
            FLYERFLIX
          </div>
          <div className="w-16 h-16 border-t-4 border-flyerflix-red border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-flyerflix-black text-white">
      <MemberSidebar />
      <main className="flex-1 overflow-y-auto px-4 py-4 md:py-8">
        {children || <Outlet />}
        {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
      </main>
    </div>
  );
};

export default MemberLayout;
