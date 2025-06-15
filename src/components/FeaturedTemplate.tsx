
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

  const handleImageError = () => {
    console.log('Background image failed to load:', template.imageUrl);
    setImageError(true);
  };

  const handleThumbnailError = () => {
    console.log('Thumbnail image failed to load:', template.imageUrl);
    setThumbnailError(true);
  };

  // Nova imagem enviada pelo usuário
  const newBgImage = '/lovable-uploads/6697774f-a624-4ff8-9fef-e5d09384fead.png';
  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

  return (
    <div className="w-full rounded-3xl overflow-hidden relative mb-8 min-h-[340px] md:min-h-[400px] lg:min-h-[480px] transition-all">
      {/* Background image sem blur, 100% visível */}
      <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
        <img
          src={newBgImage}
          alt="Destaque Flyerflix"
          className="w-full h-full object-cover object-center rounded-3xl"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {/* Gradient para legibilidade, apenas embaixo e à esquerda */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-black/5 rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center p-6 md:p-8 lg:p-12 h-full">
        {/* Template thumbnail */}
        <div className="w-36 md:w-48 lg:w-64 flex-shrink-0 mb-6 md:mb-0 rounded-3xl overflow-hidden shadow-2xl bg-gray-800 transition-all">
          <img 
            src={thumbnailError ? fallbackImage : template.imageUrl} 
            alt={template.title} 
            className="w-full aspect-[9/16] object-cover rounded-3xl" 
            onError={handleThumbnailError}
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
