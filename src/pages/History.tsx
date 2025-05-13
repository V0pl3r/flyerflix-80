
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type HistoryItemType = 'download' | 'view' | 'favorite';

type HistoryItem = {
  id: string;
  type: HistoryItemType;
  templateId: string;
  templateTitle: string;
  imageUrl: string;
  date: string;
  canvaUrl: string;
};

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
    type: 'view' as const,
    templateId: '102',
    templateTitle: 'Aniversário Tropical',
    imageUrl: 'https://source.unsplash.com/random/300x600?tropical',
    date: '2025-05-08T10:15:00',
    canvaUrl: 'https://canva.com/template/2',
  },
  {
    id: 3,
    type: 'favorite' as const,
    templateId: '103',
    templateTitle: 'Festival de Música',
    imageUrl: 'https://source.unsplash.com/random/300x600?music',
    date: '2025-05-05T16:45:00',
    canvaUrl: 'https://canva.com/template/3',
  },
];

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<HistoryItemType | 'all'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('flyerflix-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Load history from localStorage
    const storedHistory = localStorage.getItem('flyerflix-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
      setFilteredHistory(JSON.parse(storedHistory));
    } else {
      // Use mock data if no history exists (for demo purposes)
      setHistory(mockHistory as HistoryItem[]);
      setFilteredHistory(mockHistory as HistoryItem[]);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [navigate]);
  
  // Filter history by type
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.type === filterType));
    }
  }, [filterType, history]);
  
  const handleOpenCanva = (url: string) => {
    window.open(url, '_blank');
    
    toast({
      title: "Template aberto no Canva",
      description: "Uma nova aba foi aberta com seu template.",
    });
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
  
  const getActionIcon = (type: HistoryItemType) => {
    switch(type) {
      case 'download':
        return <Download size={16} className="mr-2" />;
      case 'view':
        return <Eye size={16} className="mr-2" />;
      case 'favorite':
        return <Heart size={16} className="mr-2" />;
    }
  };
  
  const getActionText = (type: HistoryItemType) => {
    switch(type) {
      case 'download':
        return 'Baixou';
      case 'view':
        return 'Visualizou';
      case 'favorite':
        return 'Favoritou';
    }
  };
  
  const getActionColor = (type: HistoryItemType) => {
    switch(type) {
      case 'download':
        return 'bg-blue-600 text-white';
      case 'view':
        return 'bg-emerald-600 text-white';
      case 'favorite':
        return 'bg-flyerflix-red text-white';
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Histórico</h1>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            className={filterType === 'all' ? 'bg-flyerflix-red' : 'text-white border-white/20'}
            size="sm"
          >
            Todos
          </Button>
          <Button 
            variant={filterType === 'download' ? 'default' : 'outline'}
            onClick={() => setFilterType('download')}
            className={filterType === 'download' ? 'bg-blue-600' : 'text-white border-white/20'}
            size="sm"
          >
            <Download size={14} className="mr-1" /> Downloads
          </Button>
          <Button 
            variant={filterType === 'view' ? 'default' : 'outline'}
            onClick={() => setFilterType('view')}
            className={filterType === 'view' ? 'bg-emerald-600' : 'text-white border-white/20'}
            size="sm"
          >
            <Eye size={14} className="mr-1" /> Visualizações
          </Button>
          <Button 
            variant={filterType === 'favorite' ? 'default' : 'outline'}
            onClick={() => setFilterType('favorite')}
            className={filterType === 'favorite' ? 'bg-flyerflix-red' : 'text-white border-white/20'}
            size="sm"
          >
            <Heart size={14} className="mr-1" /> Favoritos
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flyerflix-red"></div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 flex flex-col sm:flex-row items-center"
              >
                <div className="w-24 h-32 sm:w-16 sm:h-24 shrink-0 mb-4 sm:mb-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.templateTitle} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                
                <div className="sm:ml-4 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="text-base font-medium">{item.templateTitle}</h3>
                      <Badge className={`${getActionColor(item.type)} text-xs`}>
                        {getActionIcon(item.type)}
                        {getActionText(item.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mt-1">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  
                  <Button 
                    className="mt-3 sm:mt-0 bg-flyerflix-red hover:bg-red-700"
                    size="sm"
                    onClick={() => handleOpenCanva(item.canvaUrl)}
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Abrir no Canva
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Nenhum histórico encontrado</h3>
            <p className="text-white/70 mb-4">
              {filterType === 'all' 
                ? 'Você ainda não tem nenhum histórico de atividade.' 
                : `Você ainda não tem nenhuma atividade do tipo "${filterType}".`}
            </p>
            <Button 
              className="bg-flyerflix-red hover:bg-red-700"
              onClick={() => navigate('/dashboard')}
            >
              Explorar templates
            </Button>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default History;
