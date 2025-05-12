
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Download, Heart, History, Settings, ChevronLeft, ChevronRight, Infinity } from 'lucide-react';

type UserType = {
  name: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
};

const MemberSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
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
  
  if (!user) return null;
  
  return (
    <aside 
      className={`h-screen bg-[#0b0b0b] border-r border-white/10 fixed left-0 top-0 z-30 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
          {!collapsed && (
            <Link to="/dashboard" className="text-flyerflix-red text-xl font-bold">
              FLYERFLIX
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(prev => !prev)} 
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b border-white/10">
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="text-sm text-white/70">Bem-vindo</span>
              <span className="text-white font-medium truncate">{user.name}</span>
              <div className="mt-2">
                <Badge variant="default" className="bg-flyerflix-red font-medium text-white">
                  {user.plan === 'ultimate' ? 'Plano Ultimate' : 'Plano Grátis'}
                </Badge>
              </div>
              
              {user.plan === 'free' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Downloads hoje</span>
                    <span>{user.downloads}/{user.maxDownloads}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-flyerflix-red"
                      style={{ 
                        width: `${Math.min((user.downloads / (user.maxDownloads as number)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {user.plan === 'ultimate' && (
                <div className="flex items-center mt-3 text-sm text-white/70">
                  <Infinity size={16} className="mr-1.5" />
                  <span>Downloads ilimitados</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <User size={24} className="text-white/70" />
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
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/dashboard')
                    ? 'bg-flyerflix-red text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <User size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>Meu Perfil</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/downloads" 
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/downloads')
                    ? 'bg-flyerflix-red text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Download size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>Meus Downloads</span>}
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
              >
                <Heart size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>Favoritos</span>}
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
              >
                <History size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>Histórico</span>}
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
              >
                <Settings size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>Configurações</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Upgrade button for free plan */}
        {user.plan === 'free' && !collapsed && (
          <div className="p-4 border-t border-white/10">
            <Button className="w-full bg-gradient-to-r from-flyerflix-red to-red-700 hover:from-red-700 hover:to-flyerflix-red">
              Upgrade para Ultimate
            </Button>
          </div>
        )}
        
        {/* Mini upgrade button when collapsed */}
        {user.plan === 'free' && collapsed && (
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
    </aside>
  );
};

export default MemberSidebar;
