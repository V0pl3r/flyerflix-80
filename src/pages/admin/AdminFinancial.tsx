
import { ChartPie, Download, DollarSign, TrendingUp, CreditCard, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';
import TableCard from '@/components/admin/TableCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminFinancial = () => {
  // Mock revenue data for chart
  const revenueData = [
    { month: "Jan", receita: 5420, custos: 1240 },
    { month: "Fev", receita: 7380, custos: 1580 },
    { month: "Mar", receita: 9860, custos: 1680 },
    { month: "Abr", receita: 12540, custos: 1840 },
    { month: "Mai", receita: 15680, custos: 2100 },
    { month: "Jun", receita: 18920, custos: 2480 },
  ];
  
  // Mock transactions data
  const transactions = [
    { 
      id: '1', 
      user: 'João Silva', 
      type: 'assinatura', 
      amount: 'R$ 23,90',
      date: '2023-06-15',
      status: 'concluída',
    },
    { 
      id: '2', 
      user: 'Pedro Alves', 
      type: 'assinatura', 
      amount: 'R$ 23,90',
      date: '2023-06-18',
      status: 'concluída',
    },
    { 
      id: '3', 
      user: 'Ana Costa', 
      type: 'reembolso', 
      amount: 'R$ 23,90',
      date: '2023-06-12',
      status: 'concluída',
    },
    { 
      id: '4', 
      user: 'Luisa Mendes', 
      type: 'assinatura', 
      amount: 'R$ 23,90',
      date: '2023-07-05',
      status: 'concluída',
    },
    { 
      id: '5', 
      user: 'Carlos Santos', 
      type: 'assinatura', 
      amount: 'R$ 23,90',
      date: '2023-07-10',
      status: 'pendente',
    },
  ];
  
  // Transaction table columns
  const transactionColumns = [
    { key: 'user', title: 'Usuário' },
    { 
      key: 'type', 
      title: 'Tipo', 
      render: (value: string) => value === 'assinatura' ? (
        <Badge className="bg-blue-500">Assinatura</Badge>
      ) : (
        <Badge className="bg-amber-500">Reembolso</Badge>
      )
    },
    { 
      key: 'amount', 
      title: 'Valor',
      render: (value: string, row: any) => (
        <span className={row.type === 'reembolso' ? 'text-red-400' : 'text-emerald-400'}>
          {row.type === 'reembolso' ? `- ${value}` : value}
        </span>
      )
    },
    { 
      key: 'date', 
      title: 'Data',
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      }
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => value === 'concluída' ? (
        <Badge className="bg-emerald-500">Concluída</Badge>
      ) : (
        <Badge className="bg-yellow-500">Pendente</Badge>
      )
    },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-[#1A1F2C] gap-2">
          <Download size={16} /> Exportar Relatório
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Receita Bruta Mensal" 
          value="R$ 24.594,00" 
          icon={<DollarSign size={20} />} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatsCard 
          title="Receita Líquida Mensal" 
          value="R$ 21.890,65" 
          icon={<TrendingUp size={20} />} 
          trend={{ value: 10.8, isPositive: true }} 
        />
        <StatsCard 
          title="Taxas de Pagamento" 
          value="R$ 2.703,35" 
          icon={<CreditCard size={20} />} 
        />
        <StatsCard 
          title="Reembolsos" 
          value="R$ 119,50" 
          icon={<ArrowDownCircle size={20} />}
          trend={{ value: 0.8, isPositive: false }} 
        />
      </div>
      
      {/* Chart */}
      <div className="mb-8">
        <ChartCard
          title="Receita Mensal x Custos"
          type="line"
          data={revenueData}
          dataKeys={[
            { key: "receita", color: "#ea384c" },
            { key: "custos", color: "#3b82f6" }
          ]}
          xAxisKey="month"
        />
      </div>
      
      {/* Transactions Table */}
      <div className="mb-8">
        <TableCard
          title="Últimas Transações"
          columns={transactionColumns}
          data={transactions}
          action={
            <Button variant="link" className="text-[#ea384c]">
              Ver todas
            </Button>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartCard
            title="Crescimento da Receita Anual"
            type="bar"
            data={[
              { year: '2021', receita: 45000 },
              { year: '2022', receita: 112000 },
              { year: '2023', receita: 215000, estimado: true },
            ]}
            dataKeys={[{ key: "receita", color: "#ea384c" }]}
            xAxisKey="year"
          />
        </div>
        
        <div>
          <div className="bg-[#222222] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Distribuição de Receita</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Assinaturas</span>
                  <span className="text-sm">85%</span>
                </div>
                <div className="h-2 bg-[#1A1F2C] rounded">
                  <div className="h-full bg-[#ea384c] rounded" style={{ width: '85%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Serviços Adicionais</span>
                  <span className="text-sm">12%</span>
                </div>
                <div className="h-2 bg-[#1A1F2C] rounded">
                  <div className="h-full bg-blue-500 rounded" style={{ width: '12%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Outros</span>
                  <span className="text-sm">3%</span>
                </div>
                <div className="h-2 bg-[#1A1F2C] rounded">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: '3%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancial;
