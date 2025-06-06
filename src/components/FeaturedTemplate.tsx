
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Template } from '../data/templates';

interface FeaturedTemplateProps {
  template: Template;
  onUseNow: (template: Template) => void;
}

const FeaturedTemplate = ({ template, onUseNow }: FeaturedTemplateProps) => {
  const [imageError, setImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const handleImageError = () => {
    console.log('Background image failed to load:', template.imageUrl);
    setImageError(true);
    setBackgroundLoaded(true);
  };

  const handleThumbnailError = () => {
    console.log('Thumbnail image failed to load:', template.imageUrl);
    setThumbnailError(true);
    setThumbnailLoaded(true);
  };

  const handleBackgroundLoad = () => {
    setBackgroundLoaded(true);
  };

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop';

  return (
    <div className="w-full rounded-lg overflow-hidden relative mb-8">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      <div className="absolute inset-0">
        {!backgroundLoaded && (
          <div className="w-full h-full bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src={imageError ? fallbackImage : template.imageUrl} 
          alt={template.title}
          className={`w-full h-full object-cover opacity-60 blur-[1px] transition-opacity duration-300 ${
            backgroundLoaded ? 'opacity-60' : 'opacity-0'
          }`}
          onError={handleImageError}
          onLoad={handleBackgroundLoad}
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center p-6 md:p-8 lg:p-12">
        {/* Template thumbnail */}
        <div className="w-36 md:w-48 lg:w-64 flex-shrink-0 mb-6 md:mb-0 rounded-md overflow-hidden shadow-2xl bg-gray-800">
          {!thumbnailLoaded && (
            <div className="w-full aspect-[9/16] bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-white/50 text-sm">Carregando...</div>
            </div>
          )}
          <img 
            src={thumbnailError ? fallbackImage : template.imageUrl} 
            alt={template.title} 
            className={`w-full aspect-[9/16] object-cover transition-opacity duration-300 ${
              thumbnailLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleThumbnailError}
            onLoad={handleThumbnailLoad}
            loading="lazy"
          />
        </div>
        
        {/* Template info */}
        <div className="md:ml-8 text-center md:text-left">
          <div className="inline-block bg-flyerflix-red px-3 py-1 rounded-full text-xs font-medium text-white mb-3">
            Em destaque
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            {template.title}
          </h2>
          <p className="text-white/80 mb-6 max-w-xl">
            {template.description || 'Template especial em destaque para você. Personalize e compartilhe agora!'}
          </p>
          <Button 
            onClick={() => onUseNow(template)}
            className="bg-flyerflix-red hover:bg-red-700 text-white px-6 py-2 h-12 rounded-full"
          >
            <ExternalLink size={18} className="mr-2" />
            Usar agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTemplate;
