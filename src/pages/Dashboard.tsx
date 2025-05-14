
import { useEffect, useState } from 'react';
import MemberLayout from '../components/MemberLayout';
import TemplateCard from '../components/TemplateCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Infinity, Heart, ExternalLink } from 'lucide-react';
import { featuredTemplates, newTemplates, popularTemplates, Template } from '../data/templates';

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
};

type DownloadHistoryItem = {
  id: string;
  templateId: string;
  templateTitle: string;
  imageUrl: string;
  downloadDate: string;
  canvaUrl: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [downloadLimitReached, setDownloadLimitReached] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('flyerflix-favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    // Load download history from localStorage
    const storedDownloads = localStorage.getItem('flyerflix-downloads');
    if (storedDownloads) {
      setDownloads(JSON.parse(storedDownloads));
    }
  }, []);
  
  const handleTemplateClick = (template: Template) => {
    if (user?.plan === 'free' && template.isPremium) {
      toast({
        title: "Template Premium",
        description: "Faça upgrade para o plano Ultimate para acessar este template.",
        variant: "destructive"
      });
      return;
    }
    
    // Add extra data to selected template for modal
    const templateWithExtras = {
      ...template,
      category: template.category || 'Geral',
      downloads: template.downloads || Math.floor(Math.random() * 1000) + 100,
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    setSelectedTemplate(templateWithExtras);
    
    // Add to view history
    addToHistory(templateWithExtras, 'view');
  };
  
  const addToHistory = (template: Template, actionType: 'download' | 'view' | 'favorite') => {
    // Get the current history or initialize empty array
    const historyString = localStorage.getItem('flyerflix-history');
    const history = historyString ? JSON.parse(historyString) : [];
    
    // Add new item to history
    const historyItem = {
      id: Date.now().toString(),
      type: actionType,
      templateId: template.id,
      templateTitle: template.title,
      imageUrl: template.imageUrl,
      date: new Date().toISOString(),
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    // Add to beginning of array (most recent first)
    const updatedHistory = [historyItem, ...history];
    
    // Save back to localStorage (limit to 100 items to prevent overflow)
    localStorage.setItem('flyerflix-history', JSON.stringify(updatedHistory.slice(0, 100)));
  };
  
  const handleDownload = () => {
    if (!user || !selectedTemplate) return;
    
    // Check download limit for free users
    if (user.plan === 'free') {
      if (user.downloads >= (user.maxDownloads as number)) {
        setDownloadLimitReached(true);
        setSelectedTemplate(null);
        return;
      }
      
      // Update download count
      const updatedUser = {
        ...user,
        downloads: user.downloads + 1
      };
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    // Add to download history
    const newDownload = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      imageUrl: selectedTemplate.imageUrl,
      downloadDate: new Date().toISOString(),
      canvaUrl: selectedTemplate.canvaUrl || 'https://www.canva.com'
    };
    
    const updatedDownloads = [newDownload, ...downloads];
    setDownloads(updatedDownloads);
    localStorage.setItem('flyerflix-downloads', JSON.stringify(updatedDownloads));
    
    // Add to general history
    addToHistory(selectedTemplate, 'download');
    
    // Process download - redirect to Canva
    if (selectedTemplate.canvaUrl) {
      window.open(selectedTemplate.canvaUrl, '_blank');
    }
    
    toast({
      title: "Download iniciado!",
      description: `${selectedTemplate.title} está sendo baixado.`,
    });
    
    setSelectedTemplate(null);
  };
  
  const handleToggleFavorite = (template: Template) => {
    if (!template.id) return;
    
    let updatedFavorites: string[];
    
    if (favorites.includes(template.id)) {
      updatedFavorites = favorites.filter(id => id !== template.id);
      toast({
        title: "Removido dos favoritos",
        description: `${template.title} foi removido dos seus favoritos.`,
      });
      // Add to history
      addToHistory(template, 'favorite');
    } else {
      updatedFavorites = [...favorites, template.id];
      toast({
        title: "Adicionado aos favoritos",
        description: `${template.title} foi adicionado aos seus favoritos.`,
      });
      // Add to history
      addToHistory(template, 'favorite');
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('flyerflix-favorites', JSON.stringify(updatedFavorites));
  };
  
  const isTemplateFavorite = (id: string) => {
    return favorites.includes(id);
  };
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade em breve!",
      description: "Estamos preparando essa funcionalidade.",
    });
    setDownloadLimitReached(false);
  };
  
  // Filter templates for free users
  const filterTemplatesForPlan = (templates: Template[]) => {
    if (user?.plan === 'ultimate') return templates;
    
    // Show premium templates but they will be locked
    return templates.map(template => ({
      ...template,
      isPremium: template.isPremium || Math.random() > 0.6 // Randomly make some templates premium
    }));
  };

  return (
    <MemberLayout showWelcomeMessage={true}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Personalized recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {user?.plan === 'ultimate' ? 'Recomendados para você' : 'Templates em destaque'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filterTemplatesForPlan(featuredTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
                className="w-full"
              />
            ))}
          </div>
        </section>
        
        {/* Recent uploads */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Novidades desta semana</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filterTemplatesForPlan(newTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
                className="w-full"
              />
            ))}
          </div>
        </section>
        
        {/* Popular templates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mais baixados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filterTemplatesForPlan(popularTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
                className="w-full"
              />
            ))}
          </div>
        </section>
        
        {/* Ultimate plan exclusive section */}
        {user?.plan === 'ultimate' && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold">Conteúdo Exclusivo Ultimate</h2>
              <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-amber-400 text-black ml-3">
                Premium
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredTemplates.slice(5, 10).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={{...template, isPremium: true}}
                  onClick={() => handleTemplateClick({...template, isPremium: true})}
                  className="w-full"
                />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Template details modal - make responsive */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white max-w-[90vw] sm:max-w-md md:max-w-2xl mx-4">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.title}</DialogTitle>
                <DialogDescription className="text-white/70">
                  Categoria: {selectedTemplate.category} • {selectedTemplate.downloads} downloads
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col md:flex-row gap-6 py-4">
                <div className="w-full md:w-1/2">
                  <div className="aspect-[9/16] relative rounded-lg overflow-hidden">
                    <img 
                      src={selectedTemplate.imageUrl} 
                      alt={selectedTemplate.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    <p className="text-white/80 mb-6">
                      Este template é perfeito para criar flyers atrativos e profissionais para o seu evento.
                    </p>
                    
                    {user?.plan === 'free' && (
                      <div className="mb-6">
                        <p className="text-sm text-white/70 mb-2">Downloads restantes hoje:</p>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>{(user?.maxDownloads as number) - user?.downloads} de {user?.maxDownloads}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-flyerflix-red"
                            style={{ 
                              width: `${Math.min((user?.downloads / (user?.maxDownloads as number)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {user?.plan === 'ultimate' && (
                      <div className="flex items-center mb-6 text-white/70">
                        <Infinity size={18} className="mr-2" />
                        <span>Downloads ilimitados disponíveis</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button
                      variant="outline"
                      className={`w-full border-white/20 hover:bg-white/10 ${
                        isTemplateFavorite(selectedTemplate.id) 
                          ? 'text-flyerflix-red' 
                          : 'text-white'
                      }`}
                      onClick={() => handleToggleFavorite(selectedTemplate)}
                    >
                      <Heart
                        size={16} 
                        className={`mr-2 ${isTemplateFavorite(selectedTemplate.id) ? 'fill-flyerflix-red' : ''}`} 
                      />
                      {isTemplateFavorite(selectedTemplate.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </Button>
                    
                    <Button 
                      className="bg-flyerflix-red hover:bg-red-700 w-full min-h-[44px]"
                      onClick={handleDownload}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Editar no Canva
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Download limit reached dialog - make responsive */}
      <Dialog open={downloadLimitReached} onOpenChange={setDownloadLimitReached}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white max-w-[90vw] sm:max-w-md md:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl text-flyerflix-red font-bold">⚠️ Limite diário atingido!</DialogTitle>
            <DialogDescription className="text-white/90 text-base mt-2">
              Você já usou seus {user?.maxDownloads} downloads gratuitos hoje.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white mb-4 text-base">
              Quer desbloquear acesso ilimitado a todos os templates premium e baixar sem limites?
            </p>
            <p className="text-flyerflix-red font-medium text-lg mb-6">
              Assine o plano Ultimate e comece agora!
            </p>
          </div>
          
          <DialogFooter className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-end">
            <Button 
              className="bg-flyerflix-red hover:bg-red-700 text-base py-6 font-medium w-full sm:w-auto min-h-[44px]"
              onClick={handleUpgrade}
            >
              🔓 Atualizar para Ultimate
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDownloadLimitReached(false)} 
              className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto min-h-[44px]"
            >
              Voltar mais tarde
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberLayout>
  );
};

export default Dashboard;
