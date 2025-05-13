import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Heart, ExternalLink } from 'lucide-react';

// Mock de histórico para simular dados
const mockHistory = [
  {
    id: 1,
    type: 'download' as const,
    templateId: '101',
    templateTitle: 'Festa Neon Party',
    imageUrl: 'https://source.unsplash.com/random/300x600?neon',
    date: '2025-05-10T14:30:00',
    canvaUrl: 'https://canva.com/template/1',
  },
  {
    id: 2,
    type: 'favorite' as const,
    templateId: '201',
    templateTitle: 'Festa Retrô',
    imageUrl: 'https://source.unsplash.com/random/300x600?retro',
    date: '2025-05-11T09:30:00',
    canvaUrl: 'https://canva.com/template/4',
  },
  {
    id: 3,
    type: 'view' as const,
    templateId: '301',
    templateTitle: 'Casamento Elegante',
    imageUrl: 'https://source.unsplash.com/random/300x600?wedding',
    date: '2025-05-11T11:00:00',
    canvaUrl: 'https://canva.com/template/7',
  },
  {
    id: 4,
    type: 'download' as const,
    templateId: '102',
    templateTitle: 'Aniversário Tropical',
    imageUrl: 'https://source.unsplash.com/random/300x600?tropical',
    date: '2025-05-08T10:15:00',
    canvaUrl: 'https://canva.com/template/2',
  },
  {
    id: 5,
    type: 'view' as const,
    templateId: '302',
    templateTitle: 'Balada Techno',
    imageUrl: 'https://source.unsplash.com/random/300x600?techno',
    date: '2025-05-10T20:45:00',
    canvaUrl: 'https://canva.com/template/8',
  },
];

type HistoryItem = {
  id: number;
  type: 'download' | 'favorite' | 'view';
  templateId: string;
  templateTitle: string;
  imageUrl: string;
  date: string;
  canvaUrl: string;
};

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>(mockHistory);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('flyerflix-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Simulação de carregamento de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [navigate]);
  
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.type === activeTab));
    }
  }, [activeTab, history]);
  
  const handleOpenCanva = (url: string) => {
    window.open(url, '_blank');
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getActionIcon = (type: string) => {
    switch(type) {
      case 'download':
        return <Download size={16} className="text-green-500" />;
      case 'favorite':
        return <Heart size={16} className="text-flyerflix-red" />;
      case 'view':
        return <ExternalLink size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getActionText = (type: string) => {
    switch(type) {
      case 'download':
        return 'Baixou';
      case 'favorite':
        return 'Favoritou';
      case 'view':
        return 'Visualizou';
      default:
        return 'Interagiu com';
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Histórico</h1>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="download">Downloads</TabsTrigger>
            <TabsTrigger value="favorite">Favoritos</TabsTrigger>
            <TabsTrigger value="view">Visualizações</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flyerflix-red"></div>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 flex items-center"
                  >
                    <div className="w-16 h-24 shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.templateTitle} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center mb-1">
                        {getActionIcon(item.type)}
                        <span className="text-white/70 text-sm ml-2">
                          {getActionText(item.type)} • {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium">{item.templateTitle}</h3>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleOpenCanva(item.canvaUrl)}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Abrir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Nenhum histórico encontrado</h3>
                <p className="text-white/70 mb-4">
                  Nenhuma atividade registrada para este filtro.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  );
};

export default History;
