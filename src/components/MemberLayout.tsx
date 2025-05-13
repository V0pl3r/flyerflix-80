
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberSidebar from './MemberSidebar';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface MemberLayoutProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
}

const MemberLayout = ({ children, showWelcomeMessage = false }: MemberLayoutProps) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isPlanFree, setIsPlanFree] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const user = localStorage.getItem('flyerflix-user');
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    const isFree = userData.plan === 'free';
    setIsPlanFree(isFree);
    
    // Show banner for free users on their first visit
    if (isFree && showWelcomeMessage) {
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
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [navigate, showWelcomeMessage]);
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade em breve!",
      description: "Estamos preparando essa funcionalidade.",
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('flyerflix-user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-flyerflix-black text-white">
      {/* Sidebar - Desktop */}
      {!isMobile && <MemberSidebar />}
      
      {/* Main Content */}
      <div className={!isMobile ? "ml-16 md:ml-64 min-h-screen" : "min-h-screen"}>
        {/* Top navigation bar */}
        <header className="bg-[#0b0b0b]/90 backdrop-blur-sm border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0b0b0b] border-r border-white/10 p-0 w-64">
                <MemberSidebar isMobileDrawer />
              </SheetContent>
            </Sheet>
          )}
          
          <div className="md:hidden font-bold text-flyerflix-red text-lg">FLYERFLIX</div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </header>
        
        {/* Free plan banner */}
        {showBanner && isPlanFree && (
          <div className="bg-gradient-to-r from-flyerflix-red/20 to-black px-4 md:px-6 py-4 relative">
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white"
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
                  className="bg-flyerflix-red hover:bg-red-700"
                  onClick={handleUpgrade}
                >
                  Upgrade para Ultimate por R$23,90/mês
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white border-white/20 hover:bg-white/10"
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
          <div className="px-4 md:px-6 py-4 bg-white/5 border-b border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold">Bem-vindo à Flyerflix!</h2>
              <p className="text-white/70 mt-1">
                Explore nossa biblioteca de templates e comece a criar designs incríveis para seus eventos.
              </p>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
