
import { useEffect, useState } from 'react';
import MemberLayout from '../components/MemberLayout';
import TemplateCard from '../components/TemplateCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Infinity } from 'lucide-react';
import { featuredTemplates, newTemplates, popularTemplates } from '../data/templates';

type Template = {
  id: string;
  title: string;
  imageUrl: string;
  isPremium?: boolean;
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
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      setUser(JSON.parse(userData));
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
    
    setSelectedTemplate(template);
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
    
    // Process download
    toast({
      title: "Download iniciado!",
      description: `${selectedTemplate.title} está sendo baixado.`,
    });
    
    setSelectedTemplate(null);
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
      
      {/* Download dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Download Template</DialogTitle>
            <DialogDescription className="text-white/70">
              Você está prestes a baixar {selectedTemplate?.title}
            </DialogDescription>
          </DialogHeader>
          
          {user?.plan === 'free' && (
            <div className="py-2">
              <p className="mb-2">Downloads restantes hoje: {(user?.maxDownloads as number) - user?.downloads} de {user?.maxDownloads}</p>
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
            <div className="flex items-center py-2 text-white/70">
              <Infinity size={18} className="mr-2" />
              <span>Downloads ilimitados disponíveis</span>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancelar
            </Button>
            <Button className="bg-flyerflix-red hover:bg-red-700" onClick={handleDownload}>
              Baixar agora
            </Button>
          </DialogFooter>
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
