
import { useState, useEffect } from 'react';
import TemplateCarousel from './TemplateCarousel';
import { Template } from '../data/templates';
import { useToast } from '@/hooks/use-toast';

interface TemplateCategoriesProps {
  recommendedTemplates: Template[];
  newTemplates: Template[];
  popularTemplates: Template[];
  exclusiveTemplates: Template[];
  userPlan: 'free' | 'ultimate';
  onTemplateClick: (template: Template) => void;
  onToggleFavorite: (template: Template) => void;
  favoritesIds: string[];
}

const TemplateCategories = ({
  recommendedTemplates,
  newTemplates,
  popularTemplates,
  exclusiveTemplates,
  userPlan,
  onTemplateClick,
  onToggleFavorite,
  favoritesIds
}: TemplateCategoriesProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular um pequeno tempo de carregamento para uma melhor experiência do usuário
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      {/* Recomendado para você / Templates em destaque */}
      <TemplateCarousel 
        title={userPlan === 'ultimate' ? 'Recomendado para você' : 'Templates em destaque'} 
        templates={recommendedTemplates}
        onTemplateClick={onTemplateClick}
        onToggleFavorite={onToggleFavorite}
        favoritesIds={favoritesIds}
        showFavoriteButtons={true}
        isLoading={isLoading}
      />
      
      {/* Novidades da semana */}
      <TemplateCarousel 
        title="Novidades da semana" 
        templates={newTemplates}
        onTemplateClick={onTemplateClick}
        onToggleFavorite={onToggleFavorite}
        favoritesIds={favoritesIds}
        showFavoriteButtons={true}
        isLoading={isLoading}
      />
      
      {/* Mais acessíveis / Mais baixados */}
      <TemplateCarousel 
        title="Mais acessíveis" 
        templates={popularTemplates}
        onTemplateClick={onTemplateClick}
        onToggleFavorite={onToggleFavorite}
        favoritesIds={favoritesIds}
        showFavoriteButtons={true}
        isLoading={isLoading}
      />
      
      {/* Ultimate plan exclusive section */}
      {userPlan === 'ultimate' && (
        <TemplateCarousel 
          title="Conteúdo Exclusivo Ultimate" 
          templates={exclusiveTemplates}
          isPremiumSection={true}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TemplateCategories;
