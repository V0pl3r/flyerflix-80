
import { Users, Download, TrendingUp, ChartPie } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';
import TableCard from '@/components/admin/TableCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Mock data para demonstração
  const usersData = [
    { month: "Jan", usuarios: 400, novos: 240 },
    { month: "Fev", usuarios: 500, novos: 139 },
    { month: "Mar", usuarios: 600, novos: 180 },
    { month: "Abr", usuarios: 700, novos: 190 },
    { month: "Mai", usuarios: 800, novos: 239 },
    { month: "Jun", usuarios: 1000, novos: 250 },
  ];
  
  const downloadsData = [
    { month: "Jan", downloads: 1200 },
    { month: "Fev", downloads: 1900 },
    { month: "Mar", downloads: 3000 },
    { month: "Abr", downloads: 2800 },
    { month: "Mai", downloads: 3500 },
    { month: "Jun", downloads: 4000 },
  ];
  
  const templateColumns = [
    { key: 'title', title: 'Template' },
    { key: 'downloads', title: 'Downloads' },
    { key: 'category', title: 'Categoria' },
    { 
      key: 'premium', 
      title: 'Tipo', 
      render: (value: boolean) => value ? 
        <Badge className="bg-[#ea384c]">Premium</Badge> : 
        <Badge className="bg-gray-600">Gratuito</Badge>
    }
  ];
  
  const topTemplates = [
    { title: 'Festa Junina 2023', downloads: 523, category: 'Festas', premium: true },
    { title: 'Casamento Elegante', downloads: 487, category: 'Casamentos', premium: true },
    { title: 'Aniversário Infantil', downloads: 378, category: 'Aniversários', premium: false },
    { title: 'Confraternização Empresarial', downloads: 352, category: 'Corporativo', premium: true },
    { title: 'Halloween Party', downloads: 301, category: 'Festas', premium: false },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/relatorios">Ver relatórios detalhados</Link>
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Usuários Ativos" 
          value="1,243" 
          icon={<Users size={20} />} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatsCard 
          title="Novos Usuários (Mês)" 
          value="250" 
          icon={<Users size={20} />} 
          trend={{ value: 8.3, isPositive: true }} 
        />
        <StatsCard 
          title="Downloads Totais" 
          value="4,028" 
          icon={<Download size={20} />} 
          trend={{ value: 15.2, isPositive: true }} 
        />
        <StatsCard 
          title="Faturamento Mensal" 
          value="R$ 24.594,00" 
          icon={<TrendingUp size={20} />} 
          trend={{ value: 4.3, isPositive: true }} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Crescimento de Usuários"
          type="line"
          data={usersData}
          dataKeys={[
            { key: "usuarios", color: "#ea384c" },
            { key: "novos", color: "#3b82f6" }
          ]}
          xAxisKey="month"
        />
        <ChartCard
          title="Downloads Mensais"
          type="bar"
          data={downloadsData}
          dataKeys={[{ key: "downloads", color: "#ea384c" }]}
          xAxisKey="month"
        />
      </div>
      
      {/* Top Templates Table */}
      <div className="mb-8">
        <TableCard
          title="Top 5 Templates Mais Baixados"
          columns={templateColumns}
          data={topTemplates}
          action={
            <Button asChild variant="link" className="text-[#ea384c]">
              <Link to="/admin/templates">Ver todos</Link>
            </Button>
          }
        />
      </div>
      
      {/* Pie Chart - Distribution by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#222222] border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Festas', value: 35 },
                      { name: 'Aniversários', value: 25 },
                      { name: 'Casamentos', value: 20 },
                      { name: 'Corporativo', value: 15 },
                      { name: 'Outros', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      { name: 'Festas', color: '#ea384c' },
                      { name: 'Aniversários', color: '#3b82f6' },
                      { name: 'Casamentos', color: '#10b981' },
                      { name: 'Corporativo', color: '#f59e0b' },
                      { name: 'Outros', color: '#8b5cf6' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
