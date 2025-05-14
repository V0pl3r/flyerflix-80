
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Template, featuredTemplates, newTemplates, popularTemplates } from '../data/templates';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type TemplateViewParams = {
  id: string;
};

const TemplateView = () => {
  const { id } = useParams<TemplateViewParams>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  // Fetch template data based on ID
  useEffect(() => {
    if (!id) return;
    
    // Combine all template collections to search through
    const allTemplates = [...featuredTemplates, ...newTemplates, ...popularTemplates];
    
    // Find the template with matching ID
    const foundTemplate = allTemplates.find((t) => t.id === id);
    
    if (foundTemplate) {
      setTemplate(foundTemplate);
      
      // Check if this template is in favorites
      const storedFavorites = localStorage.getItem('flyerflix-favorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setIsFavorite(favorites.includes(id));
      }
    }
  }, [id]);
  
  // Track template view in history
  useEffect(() => {
    if (!template) return;
    
    // Add to view history
    const historyString = localStorage.getItem('flyerflix-history');
    const history = historyString ? JSON.parse(historyString) : [];
    
    const historyItem = {
      id: Date.now().toString(),
      type: 'view',
      templateId: template.id,
      templateTitle: template.title,
      imageUrl: template.imageUrl,
      date: new Date().toISOString(),
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    const updatedHistory = [historyItem, ...history];
    localStorage.setItem('flyerflix-history', JSON.stringify(updatedHistory.slice(0, 100)));
  }, [template]);
  
  const handleToggleFavorite = () => {
    if (!template?.id) return;
    
    const storedFavorites = localStorage.getItem('flyerflix-favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    let updatedFavorites: string[];
    
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: string) => fav !== template.id);
      toast({
        title: "Removido dos favoritos",
        description: `${template.title} foi removido dos seus favoritos.`,
      });
    } else {
      updatedFavorites = [...favorites, template.id];
      toast({
        title: "Adicionado aos favoritos",
        description: `${template.title} foi adicionado aos seus favoritos.`,
      });
    }
    
    localStorage.setItem('flyerflix-favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };
  
  const handleDownload = () => {
    if (!template) return;
    
    // Get current user data
    const userData = localStorage.getItem('flyerflix-user');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    
    // Check download limit for free users
    if (user.plan === 'free') {
      if (user.downloads >= user.maxDownloads) {
        toast({
          title: "Limite diário atingido!",
          description: "Você já usou seus downloads gratuitos hoje.",
          variant: "destructive"
        });
        return;
      }
      
      // Update download count
      const updatedUser = {
        ...user,
        downloads: user.downloads + 1
      };
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
    }
    
    // Add to download history
    const downloadsString = localStorage.getItem('flyerflix-downloads');
    const downloads = downloadsString ? JSON.parse(downloadsString) : [];
    
    const newDownload = {
      id: Date.now().toString(),
      templateId: template.id,
      templateTitle: template.title,
      imageUrl: template.imageUrl,
      downloadDate: new Date().toISOString(),
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    const updatedDownloads = [newDownload, ...downloads];
    localStorage.setItem('flyerflix-downloads', JSON.stringify(updatedDownloads));
    
    // Add to general history
    const historyString = localStorage.getItem('flyerflix-history');
    const history = historyString ? JSON.parse(historyString) : [];
    
    const historyItem = {
      id: Date.now().toString(),
      type: 'download',
      templateId: template.id,
      templateTitle: template.title,
      imageUrl: template.imageUrl,
      date: new Date().toISOString(),
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    const updatedHistory = [historyItem, ...history];
    localStorage.setItem('flyerflix-history', JSON.stringify(updatedHistory.slice(0, 100)));
    
    // Open Canva URL
    if (template.canvaUrl) {
      window.open(template.canvaUrl, '_blank');
    }
    
    toast({
      title: "Download iniciado!",
      description: `${template.title} está sendo baixado.`,
    });
  };
  
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white">
        <p>Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#1e1e1e] border-b border-white/10 z-10">
        <div className="container px-4 py-3 flex items-center">
          <Link to="/dashboard" className="mr-auto flex items-center text-white/80 hover:text-white">
            <ArrowLeft size={20} className="mr-1" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-lg font-medium truncate max-w-[200px]">{template.title}</h1>
        </div>
      </div>
      
      {/* Template Image */}
      <div className="container px-4 pt-6">
        <AspectRatio ratio={9/16} className="bg-black/30 rounded-lg overflow-hidden mb-6">
          <img 
            src={template.imageUrl} 
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        
        {/* Template Info */}
        <div className="mb-24">
          <p className="text-white/70 mb-4">
            Este template é perfeito para criar flyers atrativos e profissionais para o seu evento.
          </p>
          
          <div className="flex items-center text-sm text-white/60 mb-4">
            <span className="mr-4">Categoria: {template.category || 'Geral'}</span>
            <span>{template.downloads || 0} downloads</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-white/10 p-4">
        <div className="container grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className={`border-white/20 hover:bg-white/10 ${isFavorite ? 'text-flyerflix-red' : 'text-white'}`}
            onClick={handleToggleFavorite}
          >
            <Heart
              size={16} 
              className={`mr-2 ${isFavorite ? 'fill-flyerflix-red' : ''}`} 
            />
            {isFavorite ? 'Remover' : 'Favoritar'}
          </Button>
          
          <Button 
            className="bg-flyerflix-red hover:bg-red-700"
            onClick={handleDownload}
          >
            <ExternalLink size={16} className="mr-2" />
            Editar no Canva
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateView;
