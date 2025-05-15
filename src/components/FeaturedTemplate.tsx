
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Template } from '../data/templates';

interface FeaturedTemplateProps {
  template: Template;
  onUseNow: (template: Template) => void;
}

const FeaturedTemplate = ({ template, onUseNow }: FeaturedTemplateProps) => {
  return (
    <div className="w-full rounded-lg overflow-hidden relative mb-8">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      <div className="absolute inset-0">
        <img 
          src={template.imageUrl} 
          alt={template.title}
          className="w-full h-full object-cover opacity-60 blur-[1px]"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center p-6 md:p-8 lg:p-12">
        {/* Template thumbnail */}
        <div className="w-36 md:w-48 lg:w-64 flex-shrink-0 mb-6 md:mb-0 rounded-md overflow-hidden shadow-2xl">
          <img 
            src={template.imageUrl} 
            alt={template.title} 
            className="w-full aspect-[9/16] object-cover" 
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
