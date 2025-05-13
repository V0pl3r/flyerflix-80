
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DownloadItem = {
  id: string;
  templateId: string;
  templateTitle: string;
  imageUrl: string;
  downloadDate: string;
  canvaUrl: string;
};

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
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
    
    // Load downloads from local storage
    const storedDownloads = localStorage.getItem('flyerflix-downloads');
    if (storedDownloads) {
      setDownloads(JSON.parse(storedDownloads));
    }
    
    // Simulate loading delay
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
          <div className="grid grid-cols-1 gap-6">
            {downloads.map((download) => (
              <div 
                key={download.id} 
                className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 flex flex-col md:flex-row items-center"
              >
                <div className="w-32 h-48 md:w-24 md:h-36 shrink-0 mb-4 md:mb-0">
                  <img 
                    src={download.imageUrl} 
                    alt={download.templateTitle} 
                    className="w-full h-full object-cover rounded-md"
                  />
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
