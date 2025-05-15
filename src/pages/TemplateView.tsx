
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink, Check } from 'lucide-react';
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
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [similarTemplates, setSimilarTemplates] = useState<Template[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch template data based on ID
  useEffect(() => {
    if (!id) return;
    
    // Combine all template collections to search through
    const allTemplates = [...featuredTemplates, ...newTemplates, ...popularTemplates];
    
    // Find the template with matching ID
    const foundTemplate = allTemplates.find((t) => t.id === id);
    
    if (foundTemplate) {
      setTemplate(foundTemplate);
      
      // Find similar templates (same category)
      const similar = allTemplates
        .filter(t => t.category === foundTemplate.category && t.id !== id)
        .slice(0, 4);
      setSimilarTemplates(similar);
      
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
      canvaUrl: template.canvaUrl || 'https://www.canva.com',
      category: template.category
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
    
    // Show success feedback
    setShowSuccessFeedback(true);
    setTimeout(() => {
      setShowSuccessFeedback(false);
      
      // Open Canva URL
      if (template.canvaUrl) {
        window.open(template.canvaUrl, '_blank');
      }
    }, 1500);
    
    toast({
      title: "Download iniciado!",
      description: `${template.title} está sendo baixado.`,
    });
  };
  
  const navigateToSimilar = (template: Template) => {
    navigate(`/template/${template.id}`);
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
        <AspectRatio ratio={9/16} className="bg-black/30 rounded-lg overflow-hidden mb-6 relative">
          <img 
            src={template.imageUrl} 
            alt={template.title}
            className="w-full h-full object-cover"
          />
          
          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white opacity-30 text-5xl font-bold rotate-[-30deg]">
              FLYERFLIX
            </span>
          </div>
        </AspectRatio>
        
        {/* Template Info */}
        <div className="mb-24">
          <p className="text-white/70 mb-4">
            {template.description || 'Este template é perfeito para criar flyers atrativos e profissionais para o seu evento.'}
          </p>
          
          <div className="flex items-center text-sm text-white/60 mb-4">
            <span className="mr-4">Categoria: {template.category || 'Geral'}</span>
            <span>{template.downloads || 0} downloads</span>
          </div>
          
          {/* Similar Templates */}
          {similarTemplates.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Templates similares</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarTemplates.map((similarTemplate) => (
                  <div 
                    key={similarTemplate.id} 
                    className="cursor-pointer"
                    onClick={() => navigateToSimilar(similarTemplate)}
                  >
                    <div className="relative rounded-md overflow-hidden aspect-[9/16]">
                      <img 
                        src={similarTemplate.imageUrl} 
                        alt={similarTemplate.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Watermark overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white opacity-20 text-sm font-bold rotate-[-30deg]">
                          FLYERFLIX
                        </span>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Ver template</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          
          {showSuccessFeedback ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 flex items-center justify-center"
              disabled
            >
              <Check size={16} className="mr-2" />
              Baixado com sucesso!
            </Button>
          ) : (
            <Button 
              className="bg-flyerflix-red hover:bg-red-700"
              onClick={handleDownload}
            >
              <ExternalLink size={16} className="mr-2" />
              Editar no Canva
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateView;
