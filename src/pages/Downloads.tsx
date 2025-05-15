
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { featuredTemplates, newTemplates, popularTemplates, Template } from '../data/templates';

// Combine all template sources to find potential recommendations
const allTemplates = [...featuredTemplates, ...newTemplates, ...popularTemplates];

type DownloadItem = {
  id: string;
  templateId: string;
  templateTitle: string;
  imageUrl: string;
  downloadDate: string;
  canvaUrl: string;
  category?: string;
};

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('flyerflix-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Load downloads from local storage
    const storedDownloads = localStorage.getItem('flyerflix-downloads');
    if (storedDownloads) {
      // Parse downloads and add categories if missing
      let parsedDownloads = JSON.parse(storedDownloads);
      
      // Add category to each download by finding the template
      parsedDownloads = parsedDownloads.map((download: DownloadItem) => {
        // Find matching template to get category
        const matchingTemplate = allTemplates.find(t => t.id === download.templateId);
        return {
          ...download,
          category: matchingTemplate?.category || 'Outros'
        };
      });
      
      setDownloads(parsedDownloads);
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [navigate]);
  
  // Extract unique categories from downloads
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(downloads.map(download => download.category)));
    return ['all', ...uniqueCategories];
  }, [downloads]);
  
  // Filter and sort downloads
  const filteredDownloads = useMemo(() => {
    return downloads
      .filter(download => {
        return selectedCategory === 'all' || download.category === selectedCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime();
        } else {
          return new Date(a.downloadDate).getTime() - new Date(b.downloadDate).getTime();
        }
      });
  }, [downloads, selectedCategory, sortOrder]);
  
  // Group downloads by category
  const downloadsByCategory = useMemo(() => {
    const grouped: Record<string, DownloadItem[]> = {};
    
    filteredDownloads.forEach(download => {
      const category = download.category || 'Outros';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(download);
    });
    
    return grouped;
  }, [filteredDownloads]);
  
  // Get recommendations based on downloads
  const recommendations = useMemo(() => {
    if (downloads.length === 0) return [];
    
    // Get categories of downloaded items
    const downloadedCategories = downloads.map(d => d.category).filter(Boolean);
    
    // Count category occurrences
    const categoryCounts: Record<string, number> = {};
    downloadedCategories.forEach(category => {
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    
    // Sort categories by count
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Get most used category
    const topCategory = sortedCategories[0];
    
    // Find templates in this category that haven't been downloaded
    const downloadedIds = downloads.map(d => d.templateId);
    const recommendedTemplates = allTemplates
      .filter(t => t.category === topCategory && !downloadedIds.includes(t.id))
      .slice(0, 6);
    
    return recommendedTemplates;
  }, [downloads]);
  
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

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meus Downloads</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flyerflix-red"></div>
          </div>
        ) : downloads.length > 0 ? (
          <>
            <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="bg-black/20">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      {categories
                        .filter(cat => cat !== 'all')
                        .slice(0, 3)
                        .map((category) => (
                          <TabsTrigger key={category} value={category}>
                            {category}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/10 flex gap-2 items-center"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                      >
                        <Filter className="h-4 w-4" />
                        Mais categorias
                        {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Collapsible filter */}
                  <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <CollapsibleContent className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {categories
                          .filter(cat => cat !== 'all')
                          .slice(3)
                          .map(category => (
                            <Badge 
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"} 
                              className={`cursor-pointer ${selectedCategory === category ? 'bg-flyerflix-red' : 'hover:bg-white/10'}`}
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="flex justify-end mb-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={`border-white/10 ${sortOrder === 'newest' ? 'bg-white/10' : ''}`}
                        onClick={() => setSortOrder('newest')}
                      >
                        Mais recentes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={`border-white/10 ${sortOrder === 'oldest' ? 'bg-white/10' : ''}`}
                        onClick={() => setSortOrder('oldest')}
                      >
                        Mais antigos
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="all">
                    {Object.entries(downloadsByCategory).map(([category, items]) => (
                      <div key={category} className="mb-8">
                        <h2 className="text-xl font-bold mb-4">{category}</h2>
                        <div className="grid grid-cols-1 gap-4">
                          {items.map((download) => (
                            <div 
                              key={download.id} 
                              className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4 flex flex-col md:flex-row items-center"
                            >
                              <div className="w-32 h-48 md:w-24 md:h-36 shrink-0 mb-4 md:mb-0 relative">
                                <img 
                                  src={download.imageUrl} 
                                  alt={download.templateTitle} 
                                  className="w-full h-full object-cover rounded-md"
                                />
                                
                                {/* Watermark overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-white opacity-20 text-sm font-bold rotate-[-30deg]">
                                    FLYERFLIX
                                  </span>
                                </div>
                              </div>
                              
                              <div className="md:ml-5 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                                <div>
                                  <h3 className="text-lg font-medium">{download.templateTitle}</h3>
                                  <p className="text-sm text-white/70 mt-1">
                                    Baixado em {formatDate(download.downloadDate)}
                                  </p>
                                  <Badge variant="outline" className="mt-2">
                                    {download.category}
                                  </Badge>
                                </div>
                                
                                <Button 
                                  className="mt-4 md:mt-0 bg-flyerflix-red hover:bg-red-700"
                                  onClick={() => handleOpenCanva(download.canvaUrl)}
                                >
                                  <ExternalLink size={16} className="mr-2" />
                                  Abrir no Canva
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-1 gap-4">
                        {downloadsByCategory[category]?.map((download) => (
                          <div 
                            key={download.id} 
                            className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4 flex flex-col md:flex-row items-center"
                          >
                            <div className="w-32 h-48 md:w-24 md:h-36 shrink-0 mb-4 md:mb-0 relative">
                              <img 
                                src={download.imageUrl} 
                                alt={download.templateTitle} 
                                className="w-full h-full object-cover rounded-md"
                              />
                              
                              {/* Watermark overlay */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-white opacity-20 text-sm font-bold rotate-[-30deg]">
                                  FLYERFLIX
                                </span>
                              </div>
                            </div>
                            
                            <div className="md:ml-5 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                              <div>
                                <h3 className="text-lg font-medium">{download.templateTitle}</h3>
                                <p className="text-sm text-white/70 mt-1">
                                  Baixado em {formatDate(download.downloadDate)}
                                </p>
                              </div>
                              
                              <Button 
                                className="mt-4 md:mt-0 bg-flyerflix-red hover:bg-red-700"
                                onClick={() => handleOpenCanva(download.canvaUrl)}
                              >
                                <ExternalLink size={16} className="mr-2" />
                                Abrir no Canva
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">
                  Você pode gostar destes templates
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((template) => (
                    <div 
                      key={template.id} 
                      className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden flex flex-col relative cursor-pointer"
                      onClick={() => navigate(`/template/${template.id}`)}
                    >
                      <div className="relative">
                        <img 
                          src={template.imageUrl} 
                          alt={template.title} 
                          className="w-full h-52 object-cover"
                        />
                        
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-white opacity-20 text-xl font-bold rotate-[-30deg]">
                            FLYERFLIX
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-medium mb-1">{template.title}</h3>
                        <p className="text-sm text-white/50">{template.category}</p>
                        <Button 
                          variant="outline"
                          className="mt-3 text-white border-white/20"
                        >
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Nenhum download ainda</h3>
            <p className="text-white/70 mb-4">
              Você não baixou nenhum template ainda. Explore nossa biblioteca na página inicial.
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

export default Downloads;
