
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AdminRouteGuard from "./components/AdminRouteGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Downloads from "./pages/Downloads";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TemplateView from "./pages/TemplateView";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminPlans from "./pages/admin/AdminPlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/template/:id" element={<TemplateView />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/meus-downloads" element={<Downloads />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/historico" element={<History />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/area-membro" element={<Dashboard />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            
            {/* Admin Routes - Protected by AdminRouteGuard */}
            <Route 
              path="/admin" 
              element={
                <AdminRouteGuard>
                  <AdminLayout />
                </AdminRouteGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="assinaturas" element={<AdminSubscriptions />} />
              <Route path="financeiro" element={<AdminFinancial />} />
              <Route path="relatorios" element={<AdminReports />} />
              <Route path="configuracoes" element={<AdminSettings />} />
              <Route path="suporte" element={<AdminSupport />} />
              <Route path="planos" element={<AdminPlans />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
