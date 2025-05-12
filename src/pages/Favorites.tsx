
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock de favoritos para simular dados
const mockFavorites = [
  {
    id: 1,
    templateId: '201',
    templateTitle: 'Festa Retrô',
    imageUrl: 'https://source.unsplash.com/random/300x600?retro',
    addedDate: '2025-05-11T09:30:00',
    canvaUrl: 'https://canva.com/template/4',
  },
  {
    id: 2,
    templateId: '202',
    templateTitle: 'Halloween Party',
    imageUrl: 'https://source.unsplash.com/random/300x600?halloween',
    addedDate: '2025-05-10T15:20:00',
    canvaUrl: 'https://canva.com/template/5',
  },
  {
    id: 3,
    templateId: '203',
    templateTitle: 'Festa Anos 80',
    imageUrl: 'https://source.unsplash.com/random/300x600?80s',
    addedDate: '2025-05-07T11:05:00',
    canvaUrl: 'https://canva.com/template/6',
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleOpenCanva = (url: string) => {
    window.open(url, '_blank');
    
    toast({
      title: "Template aberto no Canva",
      description: "Uma nova aba foi aberta com seu template.",
    });
  };
  
  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter(favorite => favorite.id !== id));
    
    toast({
      title: "Removido dos favoritos",
      description: "O template foi removido da sua lista de favoritos.",
    });
  };

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flyerflix-red"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div 
                key={favorite.id} 
                className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img 
                    src={favorite.imageUrl} 
                    alt={favorite.templateTitle} 
                    className="w-full h-64 object-cover"
                  />
                  <Button 
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 border border-white/20 hover:bg-red-700"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                  >
                    <Heart className="h-4 w-4 fill-white" />
                  </Button>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-medium mb-2">{favorite.templateTitle}</h3>
                  <div className="mt-auto pt-4">
                    <Button 
                      className="w-full bg-flyerflix-red hover:bg-red-700"
                      onClick={() => handleOpenCanva(favorite.canvaUrl)}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Abrir no Canva
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Nenhum favorito ainda</h3>
            <p className="text-white/70 mb-4">
              Você não adicionou nenhum template aos favoritos ainda. Explore nossa biblioteca na página inicial.
            </p>
            <Button 
              className="bg-flyerflix-red hover:bg-red-700"
              onClick={() => navigate('/dashboard')}
            >
              Ver templates disponíveis
            </Button>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default Favorites;
