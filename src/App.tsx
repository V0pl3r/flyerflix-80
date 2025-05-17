
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import TemplateView from './pages/TemplateView';
import History from './pages/History';
import Downloads from './pages/Downloads';
import Profile from './pages/Profile';
import MemberLayout from './components/MemberLayout';
import { AuthProvider } from './hooks/useAuth';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPlans from './pages/admin/AdminPlans';
import AdminSettings from './pages/admin/AdminSettings';
import AdminFinancial from './pages/admin/AdminFinancial';
import AdminReports from './pages/admin/AdminReports';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminSupport from './pages/admin/AdminSupport';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          
          {/* Member Pages */}
          <Route path="/" element={<MemberLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="template/:id" element={<TemplateView />} />
            <Route path="historico" element={<History />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="planos" element={<AdminPlans />} />
            <Route path="configuracoes" element={<AdminSettings />} />
            <Route path="financeiro" element={<AdminFinancial />} />
            <Route path="relatorios" element={<AdminReports />} />
            <Route path="assinaturas" element={<AdminSubscriptions />} />
            <Route path="suporte" element={<AdminSupport />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
