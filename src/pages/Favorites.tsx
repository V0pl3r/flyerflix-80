
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { featuredTemplates, newTemplates, popularTemplates, Template } from '../data/templates';

// Combine all template sources to find favorites
const allTemplates = [...featuredTemplates, ...newTemplates, ...popularTemplates].map((template: Template) => ({
  ...template,
  canvaUrl: template.canvaUrl || `https://canva.com/template/${template.id}`
}));

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('flyerflix-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('flyerflix-favorites');
    if (storedFavorites) {
      const ids = JSON.parse(storedFavorites);
      setFavoriteIds(ids);
      
      // Find the favorite templates from all templates
      const favoriteTemplates = allTemplates.filter(template => 
        ids.includes(template.id.toString())
      ).map(template => ({
        id: template.id,
        templateId: template.id.toString(),
        templateTitle: template.title,
        imageUrl: template.imageUrl,
        addedDate: new Date().toISOString(), // Mock date
        canvaUrl: template.canvaUrl,
      }));
      
      setFavorites(favoriteTemplates);
    }
    
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
    
    // Add to history
    const historyString = localStorage.getItem('flyerflix-history');
    const history = historyString ? JSON.parse(historyString) : [];
    
    const template = favorites.find(fav => fav.canvaUrl === url);
    if (template) {
      const historyItem = {
        id: Date.now().toString(),
        type: 'download',
        templateId: template.templateId,
        templateTitle: template.templateTitle,
        imageUrl: template.imageUrl,
        date: new Date().toISOString(),
        canvaUrl: template.canvaUrl
      };
      
      localStorage.setItem('flyerflix-history', JSON.stringify([historyItem, ...history]));
    }
  };
  
  const handleRemoveFavorite = (id: string | number) => {
    const updatedFavoriteIds = favoriteIds.filter(favId => favId !== id.toString());
    setFavoriteIds(updatedFavoriteIds);
    localStorage.setItem('flyerflix-favorites', JSON.stringify(updatedFavoriteIds));
    
    const updatedFavorites = favorites.filter(favorite => favorite.id.toString() !== id.toString());
    setFavorites(updatedFavorites);
    
    // Add to history
    const historyString = localStorage.getItem('flyerflix-history');
    const history = historyString ? JSON.parse(historyString) : [];
    
    const template = favorites.find(fav => fav.id.toString() === id.toString());
    if (template) {
      const historyItem = {
        id: Date.now().toString(),
        type: 'favorite',
        templateId: template.templateId,
        templateTitle: template.templateTitle,
        imageUrl: template.imageUrl,
        date: new Date().toISOString(),
        canvaUrl: template.canvaUrl
      };
      
      localStorage.setItem('flyerflix-history', JSON.stringify([historyItem, ...history]));
    }
    
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
