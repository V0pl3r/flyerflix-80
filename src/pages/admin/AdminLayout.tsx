
import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileType, 
  Tag, 
  Users, 
  Database, 
  TrendingUp, 
  FileText,
  Settings, 
  HelpCircle,
  Menu,
  X,
  CreditCard
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    // Add animation delay for smoother page entrance
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 200);
  }, []);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#222222] transition-all duration-300 fixed h-full`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-[#ea384c] animate-fade-in">Flyerflix Admin</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 hover:bg-black/20 rounded transition-transform active:scale-90"
            aria-label={sidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => (
              <li 
                key={item.path}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NavLink
                  to={`/admin${item.path}`}
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#ea384c]/20 text-[#ea384c]' 
                        : 'hover:bg-black/20'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main 
        className={`
          flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} 
          transition-all duration-300 
          ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Header */}
        <header className="bg-[#222222] p-4 shadow-md animate-slide-in-down">
          <h1 className="text-xl font-medium">Painel Administrativo</h1>
        </header>
        
        {/* Content */}
        <div className="p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Menu items with icons and paths
const menuItems = [
  { label: 'Dashboard', path: '', icon: LayoutDashboard },
  { label: 'Templates', path: '/templates', icon: FileType },
  { label: 'Categorias', path: '/categorias', icon: Tag },
  { label: 'Planos e Preços', path: '/planos', icon: CreditCard },
  { label: 'Usuários', path: '/usuarios', icon: Users },
  { label: 'Assinaturas', path: '/assinaturas', icon: Database },
  { label: 'Financeiro', path: '/financeiro', icon: TrendingUp },
  { label: 'Relatórios', path: '/relatorios', icon: FileText },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
  { label: 'Suporte', path: '/suporte', icon: HelpCircle },
];

export default AdminLayout;
