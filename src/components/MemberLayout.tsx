import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MemberSidebar from './MemberSidebar';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import WelcomeModal from './WelcomeModal';
import ProfileModal from './ProfileModal';

interface MemberLayoutProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
}

const MemberLayout = ({ children, showWelcomeMessage = false }: MemberLayoutProps) => {
  const [showBanner, setShowBanner] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: uiToast } = useToast();
  const { user, logout, createCheckoutSession, checkSubscription, loading } = useAuth();
  
  const isPlanFree = user?.plan === 'free';
  
  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-flyerflix-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-flyerflix-red text-3xl font-bold mb-4">FLYERFLIX</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flyerflix-red mx-auto"></div>
          <p className="text-white/60 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check for upgrade query parameter
    const queryParams = new URLSearchParams(location.search);
    const upgradeStatus = queryParams.get('upgrade');
    
    if (upgradeStatus === 'success') {
      toast.success("Assinatura realizada!", {
        description: "Seu plano Ultimate foi ativado. Aproveite todos os benefícios!",
        duration: 6000,
      });
      
      // Remove the query parameter
      navigate(location.pathname, { replace: true });
      
      // Check the subscription status to update the user object
      checkSubscription();
    } else if (upgradeStatus === 'canceled') {
      toast.info("Upgrade cancelado", {
        description: "O processo de upgrade foi cancelado. Você pode tentar novamente quando desejar.",
      });
      
      // Remove the query parameter
      navigate(location.pathname, { replace: true });
    }
    
    // Show banner for free users on their first visit
    if (isPlanFree && showWelcomeMessage) {
      const hasSeenWelcome = localStorage.getItem('flyerflix-welcome-seen');
      if (!hasSeenWelcome) {
        setShowBanner(true);
        localStorage.setItem('flyerflix-welcome-seen', 'true');
      }
    }
    
    // Check if this is first time viewing dashboard
    const visitedDashboard = localStorage.getItem('flyerflix-visited-dashboard');
    if (!visitedDashboard && showWelcomeMessage) {
      setFirstVisit(true);
      localStorage.setItem('flyerflix-visited-dashboard', 'true');
    } else {
      setFirstVisit(false);
    }
    
    // Check if user is on mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Set page as loaded after a short delay for animations
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [navigate, showWelcomeMessage, isPlanFree, user, location, checkSubscription, loading]);
  
  const handleUpgrade = async () => {
    if (!user) return;
    
    const checkoutUrl = await createCheckoutSession();
    
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  // Don't render layout if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-flyerflix-black text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      {!isMobile && <MemberSidebar />}
      
      {/* Welcome Modal */}
      {showWelcomeMessage && user && <WelcomeModal userName={user.name || undefined} />}
      
      {/* Profile Modal */}
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      
      {/* Main Content */}
      <div 
        className={`
          ${!isMobile ? "ml-16 md:ml-64" : ""} 
          min-h-screen 
          transition-all duration-500 ease-in-out
          ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        {/* Top navigation bar */}
        <header className="bg-[#0b0b0b]/90 backdrop-blur-sm border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 animate-slide-in-down">
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white transition-transform active:scale-90">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0b0b0b] border-r border-white/10 p-0 w-64 animate-slide-in-left">
                <MemberSidebar isMobileDrawer />
              </SheetContent>
            </Sheet>
          )}
          
          <div className="md:hidden font-bold text-flyerflix-red text-lg">FLYERFLIX</div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
              onClick={openProfileModal}
            >
              Perfil
            </Button>
            <Button
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </header>
        
        {/* Free plan banner */}
        {showBanner && isPlanFree && (
          <div className="bg-gradient-to-r from-flyerflix-red/20 to-black px-4 md:px-6 py-4 relative animate-fade-in">
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors duration-200"
            >
              <X size={18} />
            </button>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-medium">Você está no Plano Grátis</h3>
              <p className="text-white/70 mt-1">
                Aproveite seus 2 downloads diários. Quer acesso ilimitado a todos os templates?
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button 
                  className="bg-flyerflix-red hover:bg-red-700 hover:shadow-md transition-all duration-300 active:scale-95"
                  onClick={handleUpgrade}
                >
                  Upgrade para Ultimate por R$23,90/mês
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95"
                  onClick={() => setShowBanner(false)}
                >
                  Lembrar depois
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Welcome message for first-time visitors */}
        {firstVisit && (
          <div className="px-4 md:px-6 py-4 bg-white/5 border-b border-white/10 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold">Bem-vindo à Flyerflix!</h2>
              <p className="text-white/70 mt-1">
                Explore nossa biblioteca de templates e comece a criar designs incríveis para seus eventos.
              </p>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
