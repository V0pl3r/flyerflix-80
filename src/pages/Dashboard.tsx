
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import TemplateCategories from '../components/TemplateCategories';
import TemplateFilters, { EventType } from '../components/TemplateFilters';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Infinity, Heart, ExternalLink, Check } from 'lucide-react';
import FeaturedTemplate from '@/components/FeaturedTemplate';
import YouMayAlsoLike from '@/components/YouMayAlsoLike';
import WelcomeModal from '@/components/WelcomeModal';
import OnboardingGuide from '@/components/OnboardingGuide';
import { 
  featuredTemplates, 
  newTemplates, 
  popularTemplates, 
  Template, 
  weeklyPopularTemplates,
  usedByCreatorsTemplates,
  pagodeTemplates,
  sertanejoTemplates,
  funkTemplates,
  birthdayTemplates,
  getRecommendedTemplates
} from '../data/templates';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// User and history types
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
  // User and session state
  const [user, setUser] = useState<UserType | null>(null);
  const [downloadLimitReached, setDownloadLimitReached] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>([]);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [featuredTemplate, setFeaturedTemplate] = useState<Template | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewedTemplate, setPreviewedTemplate] = useState<Template | null>(null);
  
  // UI filters and state
  const [selectedEventType, setSelectedEventType] = useState<EventType>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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

    // Set featured template (could come from an API in a real app)
    setFeaturedTemplate(featuredTemplates[0]);
    
    // Simulate loading state for smooth transitions
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(loadingTimer);
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
    
    if (isMobile) {
      // On mobile, navigate to template view page
      navigate(`/template/${templateWithExtras.id}`);
    } else {
      // On desktop, show modal
      setSelectedTemplate(templateWithExtras);
    
      // Add to view history (only for desktop since mobile handles this separately)
      addToHistory(templateWithExtras, 'view');
    }
  };
  
  const handlePreviewTemplate = (template: Template) => {
    // Quick preview mode
    setPreviewedTemplate(template);
    setIsPreviewMode(true);
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
    
    // Set download success state for feedback
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    
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

  const handleUseNow = (template: Template) => {
    if (user?.plan === 'free' && template.isPremium) {
      toast({
        title: "Template Premium",
        description: "Faça upgrade para o plano Ultimate para acessar este template.",
        variant: "destructive"
      });
      return;
    }
    
    // Add to history
    addToHistory(template, 'download');
    
    // Open canva URL
    if (template.canvaUrl) {
      window.open(template.canvaUrl, '_blank');
    }
    
    toast({
      title: "Template aberto!",
      description: `${template.title} foi aberto no Canva.`,
    });
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
    
    // Add to history
    addToHistory(template, 'favorite');
    
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

  const handleFilterChange = (filters: { eventType: EventType }) => {
    setSelectedEventType(filters.eventType);
    setIsLoading(true);
    
    // Simulate loading delay for smooth transitions
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
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

  // Combine all templates for recommendations
  const allTemplates = [
    ...featuredTemplates,
    ...newTemplates,
    ...popularTemplates,
    ...weeklyPopularTemplates,
    ...usedByCreatorsTemplates,
    ...pagodeTemplates, 
    ...sertanejoTemplates,
    ...funkTemplates,
    ...birthdayTemplates
  ];

  // Prepare templates for each category
  const recommendedTemplates = filterTemplatesForPlan(featuredTemplates);
  const weeklyNewTemplates = filterTemplatesForPlan(newTemplates.filter(t => t.isNew));
  const mostDownloadedTemplates = filterTemplatesForPlan(popularTemplates);
  const exclusiveTemplates = user?.plan === 'ultimate' 
    ? filterTemplatesForPlan(featuredTemplates.slice(5, 15).map(t => ({...t, isPremium: true})))
    : [];
  const filteredWeeklyPopularTemplates = filterTemplatesForPlan(weeklyPopularTemplates);
  const filteredUsedByCreatorsTemplates = filterTemplatesForPlan(usedByCreatorsTemplates);
  const filteredPagodeTemplates = filterTemplatesForPlan(pagodeTemplates);
  const filteredSertanejoTemplates = filterTemplatesForPlan(sertanejoTemplates);
  const filteredFunkTemplates = filterTemplatesForPlan(funkTemplates);
  const filteredBirthdayTemplates = filterTemplatesForPlan(birthdayTemplates);
  const personalizedRecommendations = filterTemplatesForPlan(getRecommendedTemplates(favorites));

  return (
    <MemberLayout showWelcomeMessage={true}>
      {/* Welcome modal for first-time users */}
      {/* <WelcomeModal userName={user?.name?.split(' ')[0]} /> */}
      
      {/* Onboarding guide for new users */}
      <OnboardingGuide />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Event type filter */}
        <TemplateFilters 
          onFilterChange={handleFilterChange}
          selectedEventType={selectedEventType}
        />
        
        {/* Featured template - only show on homepage (not when filtering) */}
        {selectedEventType === 'all' && featuredTemplate && (
          <FeaturedTemplate 
            template={featuredTemplate} 
            onUseNow={handleUseNow}
          />
        )}
        
        {/* You may also like section - only show if user has downloads and not filtering */}
        {selectedEventType === 'all' && downloads.length > 0 && (
          <YouMayAlsoLike
            downloads={downloads}
            allTemplates={allTemplates}
            onTemplateClick={handleTemplateClick}
            onToggleFavorite={handleToggleFavorite}
            favoritesIds={favorites}
          />
        )}
        
        {/* Template categories section */}
        <TemplateCategories
          recommendedTemplates={recommendedTemplates}
          newTemplates={weeklyNewTemplates}
          popularTemplates={mostDownloadedTemplates}
          exclusiveTemplates={exclusiveTemplates}
          weeklyPopularTemplates={filteredWeeklyPopularTemplates}
          usedByCreatorsTemplates={filteredUsedByCreatorsTemplates}
          pagodeTemplates={filteredPagodeTemplates}
          sertanejoTemplates={filteredSertanejoTemplates}
          funkTemplates={filteredFunkTemplates}
          birthdayTemplates={filteredBirthdayTemplates}
          userPlan={user?.plan as 'free' | 'ultimate'}
          onTemplateClick={handleTemplateClick}
          onToggleFavorite={handleToggleFavorite}
          onPreviewTemplate={handlePreviewTemplate}
          favoritesIds={favorites}
          selectedEventType={selectedEventType}
          personalizedRecommendations={personalizedRecommendations}
          isLoading={isLoading}
        />
      </div>
      
      {/* Quick template preview modal */}
      <Dialog 
        open={isPreviewMode} 
        onOpenChange={(open) => !open && setIsPreviewMode(false)}
      >
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white w-full sm:max-w-md">
          {previewedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{previewedTemplate.title}</DialogTitle>
                <DialogDescription className="text-white/70 text-xs">
                  Pré-visualização rápida
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="relative rounded-md overflow-hidden">
                  <AspectRatio ratio={9/16}>
                    <img 
                      src={previewedTemplate.imageUrl} 
                      alt={previewedTemplate.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Watermark overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-white font-bold text-4xl opacity-20 rotate-[-30deg]">
                        FLYERFLIX
                      </p>
                    </div>
                  </AspectRatio>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-white/20 hover:bg-white/10 ${
                      isTemplateFavorite(previewedTemplate.id) 
                        ? 'text-flyerflix-red' 
                        : 'text-white'
                    }`}
                    onClick={() => handleToggleFavorite(previewedTemplate)}
                  >
                    <Heart
                      size={16} 
                      className={`mr-2 ${isTemplateFavorite(previewedTemplate.id) ? 'fill-flyerflix-red' : ''}`} 
                    />
                    {isTemplateFavorite(previewedTemplate.id) ? 'Remover' : 'Favoritar'}
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setIsPreviewMode(false);
                      handleTemplateClick(previewedTemplate);
                    }}
                    className="bg-flyerflix-red hover:bg-red-700"
                    size="sm"
                  >
                    Ver detalhes completos
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Template details modal - only shown on desktop */}
      <Dialog open={!!selectedTemplate && !isMobile} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white w-full sm:max-w-md md:max-w-2xl">
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
                    
                    {/* Watermark overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-white font-bold text-4xl opacity-20 rotate-[-30deg]">
                        FLYERFLIX
                      </p>
                    </div>
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
                      className={`bg-flyerflix-red hover:bg-red-700 w-full min-h-[44px] ${
                        downloadSuccess ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                      onClick={handleDownload}
                    >
                      {downloadSuccess ? (
                        <>
                          <Check size={16} className="mr-2" />
                          Baixado com sucesso!
                        </>
                      ) : (
                        <>
                          <ExternalLink size={16} className="mr-2" />
                          Editar no Canva
                        </>
                      )}
                    </Button>

                    {downloadSuccess && (
                      <Button 
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10 w-full"
                        onClick={() => {
                          setSelectedTemplate(null);
                          // Logic to show more like this
                          toast({
                            title: "Mais templates semelhantes",
                            description: "Mostrando templates similares...",
                          });
                        }}
                      >
                        Ver mais como este
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Download limit reached dialog */}
      <Dialog open={downloadLimitReached} onOpenChange={setDownloadLimitReached}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white w-full sm:max-w-md md:max-w-lg">
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

