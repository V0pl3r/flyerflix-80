
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { featuredTemplates, newTemplates, popularTemplates, Template } from '../data/templates';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

// Combine all template sources to find favorites
const allTemplates = [...featuredTemplates, ...newTemplates, ...popularTemplates].map((template: Template) => ({
  ...template,
  canvaUrl: template.canvaUrl || `https://canva.com/template/${template.id}`,
  addedDate: new Date().toISOString() // Mock date for sorting
}));

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract unique categories from favorites
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(favorites.map(fav => fav.category)));
    return ['all', ...uniqueCategories];
  }, [favorites]);
  
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
        category: template.category || 'Outros',
        addedDate: new Date().toISOString(), // Mock date
        canvaUrl: template.canvaUrl,
      }));
      
      setFavorites(favoriteTemplates);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [navigate]);
  
  // Filtered and sorted favorites
  const filteredFavorites = useMemo(() => {
    return favorites
      .filter(fav => {
        const matchesSearch = fav.templateTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || fav.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        } else {
          return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
        }
      });
  }, [favorites, searchTerm, selectedCategory, sortOrder]);
  
  // Group favorites by category
  const favoritesByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    filteredFavorites.forEach(favorite => {
      const category = favorite.category || 'Outros';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(favorite);
    });
    
    return grouped;
  }, [filteredFavorites]);
  
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
          <>
            {/* Search and filter bar */}
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar favoritos..."
                    className="pl-10 bg-black/30 border-white/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-white/10 flex gap-2 items-center"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-4 w-4" />
                    Filtrar
                    {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`border-white/10 ${sortOrder === 'newest' ? 'bg-white/10' : ''}`}
                    onClick={() => setSortOrder('newest')}
                  >
                    Mais recentes
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`border-white/10 ${sortOrder === 'oldest' ? 'bg-white/10' : ''}`}
                    onClick={() => setSortOrder('oldest')}
                  >
                    Mais antigos
                  </Button>
                </div>
              </div>
              
              {/* Collapsible filter */}
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleContent className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge 
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"} 
                        className={`cursor-pointer ${selectedCategory === category ? 'bg-flyerflix-red' : 'hover:bg-white/10'}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'Todas categorias' : category}
                      </Badge>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {/* Display by category or flat grid */}
            {selectedCategory === 'all' ? (
              // Display by categories
              Object.entries(favoritesByCategory).map(([category, items]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-bold mb-4">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((favorite) => (
                      <div 
                        key={favorite.id} 
                        className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden flex flex-col"
                      >
                        <div className="relative">
                          <div className="relative">
                            <img 
                              src={favorite.imageUrl} 
                              alt={favorite.templateTitle} 
                              className="w-full h-64 object-cover"
                            />
                            {/* Watermark overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-white opacity-20 text-2xl font-bold rotate-[-30deg]">
                                FLYERFLIX
                              </span>
                            </div>
                          </div>
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
                          <h3 className="text-lg font-medium mb-1">{favorite.templateTitle}</h3>
                          <p className="text-xs text-white/60 mb-2">
                            Adicionado em {formatDate(favorite.addedDate)}
                          </p>
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
                </div>
              ))
            ) : (
              // Display flat grid with the selected category
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((favorite) => (
                  <div 
                    key={favorite.id} 
                    className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden flex flex-col"
                  >
                    <div className="relative">
                      <div className="relative">
                        <img 
                          src={favorite.imageUrl} 
                          alt={favorite.templateTitle} 
                          className="w-full h-64 object-cover"
                        />
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-white opacity-20 text-2xl font-bold rotate-[-30deg]">
                            FLYERFLIX
                          </span>
                        </div>
                      </div>
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
                      <h3 className="text-lg font-medium mb-1">{favorite.templateTitle}</h3>
                      <p className="text-xs text-white/60 mb-2">
                        Adicionado em {formatDate(favorite.addedDate)}
                      </p>
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
            )}
          </>
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
