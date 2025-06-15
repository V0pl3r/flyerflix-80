import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, Home, Download, Heart, History, Settings, ChevronLeft, ChevronRight, Infinity, Menu } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProfileModal from './ProfileModal';

type UserType = {
  name: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
  avatarUrl?: string;
};

interface MemberSidebarProps {
  isMobileDrawer?: boolean;
}

const MemberSidebar = ({ isMobileDrawer = false }: MemberSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };
  
  const handleAvatarClick = () => {
    setIsProfileModalOpen(true);
  };
  
  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        {(!collapsed || isMobileDrawer) && (
          <Link to="/dashboard" className="text-flyerflix-red text-xl font-bold">
            FLYERFLIX
          </Link>
        )}
        {!isMobileDrawer && (
          <button 
            onClick={() => setCollapsed(prev => !prev)} 
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>
      
      {/* User info */}
      <div className="p-4 border-b border-white/10">
        {(!collapsed || isMobileDrawer) ? (
          <div className="flex items-center">
            <div className="cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-12 w-12 border-2 border-flyerflix-red">
                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                <AvatarFallback className="bg-flyerflix-black text-flyerflix-red">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <div className="font-medium text-white">{getFirstName(user.name)}</div>
              <div>
                <Badge variant="default" className="bg-flyerflix-red font-medium text-white">
                  {user.plan === 'ultimate' ? 'Plano Ultimate' : 'Plano Grátis'}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Avatar className="h-10 w-10 border-2 border-flyerflix-red cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-flyerflix-black text-flyerflix-red">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.plan === 'ultimate' ? (
              <Badge variant="default" className="bg-flyerflix-red text-white mt-2 px-1">
                <Infinity size={12} />
              </Badge>
            ) : (
              <Badge variant="default" className="bg-flyerflix-red text-white text-xs mt-2 px-1">
                {user.downloads}/{user.maxDownloads}
              </Badge>
            )}
          </div>
        )}
        
        {(!collapsed || isMobileDrawer) && user.plan === 'free' && (
          <div className="mt-3 relative">
            {/* Badge lateral acima da barra */}
            <div className="absolute -top-2 right-0 bg-flyerflix-red px-2 py-0.5 rounded-full text-xs text-white font-bold z-10 shadow-md">
              {user.downloads} de {user.maxDownloads}
            </div>
            {/* Área de valores extremos */}
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>0</span>
              <span>{user.maxDownloads}</span>
            </div>
            {/* Barra preta fina, quadrada */}
            <div className="h-[4px] w-full bg-black relative" style={{ borderRadius: 0 }}>
              <div
                className="h-full bg-flyerflix-red transition-all"
                style={{
                  width: `${Math.min(
                    (user.downloads / (user.maxDownloads as number)) * 100,
                    100
                  )}%`,
                  borderRadius: 0,
                }}
              />
            </div>
          </div>
        )}
        
        {(!collapsed || isMobileDrawer) && user.plan === 'ultimate' && (
          <div className="flex items-center mt-3 text-sm text-white/70">
            <Infinity size={16} className="mr-1.5" />
            <span>Downloads ilimitados</span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/dashboard') || isActive('/area-membro')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <Home size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/perfil" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/perfil')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <User size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Meu Perfil</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/meus-downloads" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/meus-downloads')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <Download size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Meus Downloads</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/favoritos" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/favoritos')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <Heart size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Favoritos</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/historico" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/historico')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <History size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Histórico</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/configuracoes" 
              className={`flex items-center px-3 py-2 rounded-lg transition ${
                isActive('/configuracoes')
                  ? 'bg-flyerflix-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => isMobileDrawer && setIsMobileOpen(false)}
            >
              <Settings size={18} className={collapsed && !isMobileDrawer ? 'mx-auto' : 'mr-3'} />
              {(!collapsed || isMobileDrawer) && <span>Configurações</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Upgrade button for free plan */}
      {user.plan === 'free' && (!collapsed || isMobileDrawer) && (
        <div className="p-4 border-t border-white/10">
          <Button className="w-full bg-gradient-to-r from-flyerflix-red to-red-700 hover:from-red-700 hover:to-flyerflix-red min-h-[44px]">
            Upgrade para Ultimate
          </Button>
        </div>
      )}
      
      {/* Mini upgrade button when collapsed */}
      {user.plan === 'free' && collapsed && !isMobileDrawer && (
        <div className="p-2 border-t border-white/10">
          <Button className="w-full h-10 p-0 bg-gradient-to-r from-flyerflix-red to-red-700 hover:from-red-700 hover:to-flyerflix-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-.5h0a1 1 0 0 0-1-1h-2a1 1 0 0 1-1-1 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v.5"></path>
              <path d="M18 11V9.5a2.5 2.5 0 0 1 5 0v7"></path>
              <path d="M18 14c-1-1.6-2-2-3.5-2H14a2 2 0 0 0 0 4h1"></path>
              <path d="M5 18h1"></path>
              <path d="M12 18h1"></path>
              <path d="M9 18h1"></path>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
  
  // For desktop
  if (!isMobileDrawer) {
    return (
      <>
        {/* Profile Modal */}
        <ProfileModal 
          open={isProfileModalOpen} 
          onOpenChange={setIsProfileModalOpen} 
        />
        
        {/* Mobile sidebar trigger - only visible on small screens */}
        <div className="md:hidden fixed top-4 left-4 z-40">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white bg-flyerflix-black/80 backdrop-blur-md">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0b0b0b] p-0 border-r border-white/10 w-[280px]">
              <MemberSidebar isMobileDrawer={true} />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop sidebar */}
        <aside 
          className={`h-screen bg-[#0b0b0b] border-r border-white/10 fixed left-0 top-0 z-30 transition-all duration-300 hidden md:block ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          <SidebarContent />
        </aside>
      </>
    );
  }
  
  // For mobile drawer
  return (
    <>
      <ProfileModal 
        open={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen} 
      />
      <SidebarContent />
    </>
  );
};

export default MemberSidebar;
