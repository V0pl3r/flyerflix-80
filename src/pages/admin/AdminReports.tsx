
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChartCard from '@/components/admin/ChartCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, BarChart, Download } from 'lucide-react';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('last30days');
  
  // Mock data for usage by category
  const categoryUsageData = [
    { category: 'Festas', downloads: 1245 },
    { category: 'Aniversários', downloads: 980 },
    { category: 'Casamentos', downloads: 754 },
    { category: 'Corporativo', downloads: 435 },
    { category: 'Outros', downloads: 210 },
  ];
  
  // Mock data for top templates
  const topTemplatesData = [
    { template: 'Festa Junina', downloads: 523 },
    { template: 'Casamento Elegante', downloads: 487 },
    { template: 'Aniversário Infantil', downloads: 378 },
    { template: 'Confraternização', downloads: 352 },
    { template: 'Halloween Party', downloads: 301 },
  ];
  
  // Mock data for user growth
  const userGrowthData = [
    { month: 'Jan', usuarios: 125, pagos: 45, gratuitos: 80 },
    { month: 'Fev', usuarios: 158, pagos: 62, gratuitos: 96 },
    { month: 'Mar', usuarios: 190, pagos: 78, gratuitos: 112 },
    { month: 'Abr', usuarios: 225, pagos: 95, gratuitos: 130 },
    { month: 'Mai', usuarios: 280, pagos: 115, gratuitos: 165 },
    { month: 'Jun', usuarios: 354, pagos: 130, gratuitos: 224 },
  ];
  
  // Mock data for conversion rates
  const conversionData = [
    { month: 'Jan', taxa: 15.8 },
    { month: 'Fev', taxa: 17.2 },
    { month: 'Mar', taxa: 16.9 },
    { month: 'Abr', taxa: 18.3 },
    { month: 'Mai', taxa: 18.7 },
    { month: 'Jun', taxa: 19.2 },
  ];
  
  // Mock data for cancellation reasons
  const cancellationData = [
    { reason: 'Muito caro', count: 32 },
    { reason: 'Pouco uso', count: 27 },
    { reason: 'Recursos insuficientes', count: 15 },
    { reason: 'Qualidade dos templates', count: 8 },
    { reason: 'Outro', count: 4 },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        
        <div className="flex gap-3">
          <Select 
            value={dateRange}
            onValueChange={setDateRange}
          >
            <SelectTrigger className="bg-[#1A1F2C] border-0 w-[180px]">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2C] border-gray-800">
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last90days">Últimos 90 dias</SelectItem>
              <SelectItem value="thisYear">Este ano</SelectItem>
              <SelectItem value="allTime">Todo período</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-[#1A1F2C] gap-2">
            <Download size={16} /> Exportar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="usage" className="mb-8">
        <TabsList className="bg-[#1A1F2C] border-b border-gray-800 rounded-none p-0 h-auto">
          <TabsTrigger 
            value="usage" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Uso de Templates
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Crescimento de Usuários
          </TabsTrigger>
          <TabsTrigger 
            value="conversion" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Conversão e Retenção
          </TabsTrigger>
        </TabsList>
        
        {/* Templates Usage Tab */}
        <TabsContent value="usage" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title="Downloads por Categoria"
              type="bar"
              data={categoryUsageData}
              dataKeys={[{ key: "downloads", color: "#ea384c" }]}
              xAxisKey="category"
            />
            <ChartCard
              title="Top 5 Templates Mais Baixados"
              type="bar"
              data={topTemplatesData}
              dataKeys={[{ key: "downloads", color: "#3b82f6" }]}
              xAxisKey="template"
            />
          </div>
          
          <Card className="bg-[#222222] border-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Detalhamento de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1A1F2C] rounded-lg p-4 flex flex-col items-center justify-center">
                  <FileText size={32} className="text-[#ea384c] mb-2" />
                  <h4 className="text-xl font-semibold">3,624</h4>
                  <p className="text-sm text-gray-400">Downloads Totais</p>
                </div>
                <div className="bg-[#1A1F2C] rounded-lg p-4 flex flex-col items-center justify-center">
                  <BarChart size={32} className="text-[#ea384c] mb-2" />
                  <h4 className="text-xl font-semibold">120</h4>
                  <p className="text-sm text-gray-400">Media Diária</p>
                </div>
                <div className="bg-[#1A1F2C] rounded-lg p-4 flex flex-col items-center justify-center">
                  <FileText size={32} className="text-[#ea384c] mb-2" />
                  <h4 className="text-xl font-semibold">73%</h4>
                  <p className="text-sm text-gray-400">Templates Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Growth Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard
              title="Crescimento de Usuários por Tipo"
              type="line"
              data={userGrowthData}
              dataKeys={[
                { key: "usuarios", color: "#ea384c" },
                { key: "pagos", color: "#3b82f6" },
                { key: "gratuitos", color: "#10b981" }
              ]}
              xAxisKey="month"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#222222] border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Usuários Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-1">354</h2>
                  <p className="text-sm text-emerald-500">+26.4% vs. mês anterior</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#222222] border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Usuários Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-1">130</h2>
                  <p className="text-sm text-emerald-500">+13.0% vs. mês anterior</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#222222] border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Taxa de Aquisição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-1">74</h2>
                  <p className="text-sm text-emerald-500">novos usuários/mês</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Conversion and Retention Tab */}
        <TabsContent value="conversion" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title="Taxa de Conversão Grátis → Ultimate (%)"
              type="line"
              data={conversionData}
              dataKeys={[{ key: "taxa", color: "#ea384c" }]}
              xAxisKey="month"
            />
            <ChartCard
              title="Razões para Cancelamento"
              type="bar"
              data={cancellationData}
              dataKeys={[{ key: "count", color: "#3b82f6" }]}
              xAxisKey="reason"
            />
          </div>
          
          <Card className="bg-[#222222] border-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Métricas de Retenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1A1F2C] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Taxa de Retenção</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">87.3%</span>
                    <span className="text-xs text-emerald-500">↑ 2.1%</span>
                  </div>
                </div>
                
                <div className="bg-[#1A1F2C] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Taxa de Churn</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">2.1%</span>
                    <span className="text-xs text-emerald-500">↓ 0.4%</span>
                  </div>
                </div>
                
                <div className="bg-[#1A1F2C] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Valor Médio p/ Usuário</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">R$19.70</span>
                    <span className="text-xs text-emerald-500">↑ R$1.20</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
