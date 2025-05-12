
import { useState } from 'react';
import { Search, Download, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';

// Mock subscription data
const mockSubscriptions = [
  { 
    id: '1', 
    user: 'João Silva', 
    email: 'joao@email.com',
    plan: 'ultimate', 
    status: 'ativa', 
    value: 'R$ 23,90',
    startDate: '2023-03-15',
    endDate: '2023-04-15',
  },
  { 
    id: '2', 
    user: 'Pedro Alves', 
    email: 'pedro@email.com',
    plan: 'ultimate', 
    status: 'ativa', 
    value: 'R$ 23,90',
    startDate: '2023-06-18',
    endDate: '2023-07-18',
  },
  { 
    id: '3', 
    user: 'Carlos Santos', 
    email: 'carlos@email.com',
    plan: 'ultimate', 
    status: 'pendente', 
    value: 'R$ 23,90',
    startDate: '2023-05-10',
    endDate: '2023-06-10',
  },
  { 
    id: '4', 
    user: 'Fernanda Lima', 
    email: 'fernanda@email.com',
    plan: 'ultimate', 
    status: 'cancelada', 
    value: 'R$ 23,90',
    startDate: '2023-01-22',
    endDate: '2023-02-22',
  },
  { 
    id: '5', 
    user: 'Luisa Mendes', 
    email: 'luisa@email.com',
    plan: 'ultimate', 
    status: 'ativa', 
    value: 'R$ 23,90',
    startDate: '2023-07-05',
    endDate: '2023-08-05',
  },
];

// Mock growth data for chart
const growthData = [
  { month: 'Jan', assinantes: 45 },
  { month: 'Fev', assinantes: 62 },
  { month: 'Mar', assinantes: 78 },
  { month: 'Abr', assinantes: 95 },
  { month: 'Mai', assinantes: 115 },
  { month: 'Jun', assinantes: 130 },
  { month: 'Jul', assinantes: 148 },
];

// Mock churn data for chart
const churnData = [
  { month: 'Jan', taxa: 3.2 },
  { month: 'Fev', taxa: 2.8 },
  { month: 'Mar', taxa: 3.5 },
  { month: 'Abr', taxa: 2.9 },
  { month: 'Mai', taxa: 2.3 },
  { month: 'Jun', taxa: 2.1 },
  { month: 'Jul', taxa: 1.9 },
];

const AdminSubscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter subscriptions based on search term
  const filteredSubscriptions = mockSubscriptions.filter(sub => 
    sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Count subscriptions by status
  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'ativa').length;
  const pendingSubscriptions = mockSubscriptions.filter(sub => sub.status === 'pendente').length;
  const canceledSubscriptions = mockSubscriptions.filter(sub => sub.status === 'cancelada').length;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-emerald-500">Ativa</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Assinaturas</h1>
        <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-[#1A1F2C] gap-2">
          <Download size={16} /> Exportar CSV
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Assinaturas Ativas" 
          value={activeSubscriptions} 
          icon={<TrendingUp size={20} />} 
        />
        <StatsCard 
          title="Assinaturas Pendentes" 
          value={pendingSubscriptions} 
          icon={<FileText size={20} />} 
        />
        <StatsCard 
          title="Cancelamentos no Mês" 
          value={canceledSubscriptions} 
          icon={<Download size={20} />}
          trend={{ value: 1.2, isPositive: false }} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Crescimento de Assinantes"
          type="line"
          data={growthData}
          dataKeys={[{ key: "assinantes", color: "#ea384c" }]}
          xAxisKey="month"
        />
        <ChartCard
          title="Taxa de Churn (%)"
          type="bar"
          data={churnData}
          dataKeys={[{ key: "taxa", color: "#ea384c" }]}
          xAxisKey="month"
        />
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          className="bg-[#1A1F2C] border-0 pl-10" 
          placeholder="Buscar por nome ou email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Subscriptions Table */}
      <div className="bg-[#222222] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#1A1F2C]">
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Próxima Cobrança</TableHead>
              <TableHead className="text-right">Gateway</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-[#1A1F2C]">
                <TableCell className="font-medium">{sub.user}</TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>
                  <Badge className="bg-[#ea384c]">{sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(sub.status)}</TableCell>
                <TableCell>{sub.value}</TableCell>
                <TableCell>{formatDate(sub.startDate)}</TableCell>
                <TableCell>{formatDate(sub.endDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 gap-1">
                    <ExternalLink size={14} /> Stripe
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-[#1A1F2C]">
          Carregar mais
        </Button>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
