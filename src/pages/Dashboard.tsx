
import { useEffect, useState } from 'react';
import MemberLayout from '../components/MemberLayout';
import TemplateCard from '../components/TemplateCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Infinity, Heart, ExternalLink } from 'lucide-react';
import { featuredTemplates, newTemplates, popularTemplates } from '../data/templates';

type Template = {
  id: string;
  title: string;
  imageUrl: string;
  isPremium?: boolean;
  category?: string;
  downloads?: number;
  canvaUrl?: string;
};

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
};

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [downloadLimitReached, setDownloadLimitReached] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Carregar favoritos do localStorage
    const storedFavorites = localStorage.getItem('flyerflix-favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
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
    
    // Adicionar dados extras ao template selecionado para o modal
    const templateWithExtras = {
      ...template,
      category: template.category || 'Geral',
      downloads: template.downloads || Math.floor(Math.random() * 1000) + 100,
      canvaUrl: template.canvaUrl || 'https://www.canva.com'
    };
    
    setSelectedTemplate(templateWithExtras);
    
    // Registrar visualização no histórico (simulado)
    console.log('Template visualizado:', template.id);
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
    } else {
      updatedFavorites = [...favorites, template.id];
      toast({
        title: "Adicionado aos favoritos",
        description: `${template.title} foi adicionado aos seus favoritos.`,
      });
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
      <div className="max-w-6xl mx-auto">
        {/* Personalized recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {user?.plan === 'ultimate' ? 'Recomendados para você' : 'Templates em destaque'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filterTemplatesForPlan(featuredTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
              />
            ))}
          </div>
        </section>
        
        {/* Recent uploads */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Novidades desta semana</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filterTemplatesForPlan(newTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
              />
            ))}
          </div>
        </section>
        
        {/* Popular templates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mais baixados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filterTemplatesForPlan(popularTemplates.slice(0, 5)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
                isPremium={template.isPremium}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredTemplates.slice(5, 10).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={{...template, isPremium: true}}
                  onClick={() => handleTemplateClick({...template, isPremium: true})}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Template details modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white max-w-md md:max-w-2xl">
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
                      className="bg-flyerflix-red hover:bg-red-700 w-full"
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
      
      {/* Download limit reached dialog */}
      <Dialog open={downloadLimitReached} onOpenChange={setDownloadLimitReached}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Limite de downloads atingido</DialogTitle>
            <DialogDescription className="text-white/70">
              Você atingiu seu limite diário de downloads gratuitos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center">
            <Lock className="text-flyerflix-red h-16 w-16 mb-3" />
            <p className="text-center">
              Seu limite será renovado em 
              <span className="text-flyerflix-red font-bold mx-1">
                {new Date(new Date().setHours(24, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              ou faça upgrade para downloads ilimitados.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadLimitReached(false)}>
              Voltar mais tarde
            </Button>
            <Button className="bg-flyerflix-red hover:bg-red-700" onClick={handleUpgrade}>
              Fazer upgrade para Ultimate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MemberLayout>
  );
};

export default Dashboard;
