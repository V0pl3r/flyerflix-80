
import { useState, useEffect } from 'react';
import TemplateCarousel from './TemplateCarousel';
import { Template } from '../data/templates';
import { useToast } from '@/hooks/use-toast';
import { EventType } from './TemplateFilters';
import { getRecommendedTemplates } from '../data/templates';

interface TemplateCategoriesProps {
  recommendedTemplates: Template[];
  newTemplates: Template[];
  popularTemplates: Template[];
  exclusiveTemplates: Template[];
  weeklyPopularTemplates: Template[];
  usedByCreatorsTemplates: Template[];
  pagodeTemplates: Template[];
  sertanejoTemplates: Template[];
  funkTemplates: Template[];
  birthdayTemplates: Template[];
  userPlan: 'free' | 'ultimate';
  onTemplateClick: (template: Template) => void;
  onToggleFavorite: (template: Template) => void;
  favoritesIds: string[];
  selectedEventType: EventType;
}

const TemplateCategories = ({
  recommendedTemplates,
  newTemplates,
  popularTemplates,
  exclusiveTemplates,
  weeklyPopularTemplates,
  usedByCreatorsTemplates,
  pagodeTemplates,
  sertanejoTemplates,
  funkTemplates,
  birthdayTemplates,
  userPlan,
  onTemplateClick,
  onToggleFavorite,
  favoritesIds,
  selectedEventType
}: TemplateCategoriesProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Template[]>([]);

  // Filter templates based on selected event type
  const filterByEventType = (templates: Template[]) => {
    if (selectedEventType === 'all') return templates;
    return templates.filter(template => template.eventType === selectedEventType);
  };

  useEffect(() => {
    // Generate personalized recommendations based on favorites
    const recommendations = getRecommendedTemplates(favoritesIds);
    setPersonalizedRecommendations(recommendations);
    
    // Simular um pequeno tempo de carregamento para uma melhor experiência do usuário
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [favoritesIds, selectedEventType]);

  // Filter all template collections by the selected event type
  const filteredRecommended = filterByEventType(recommendedTemplates);
  const filteredNew = filterByEventType(newTemplates);
  const filteredPopular = filterByEventType(popularTemplates);
  const filteredExclusive = filterByEventType(exclusiveTemplates);
  const filteredWeeklyPopular = filterByEventType(weeklyPopularTemplates);
  const filteredUsedByCreators = filterByEventType(usedByCreatorsTemplates);
  const filteredPageSettings = filterByEventType(personalizedRecommendations);

  // Custom section rendering based on event type selection
  const renderEventBasedSections = () => {
    if (selectedEventType === 'pagode' && pagodeTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Pagode"
          templates={pagodeTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      );
    }
    
    if (selectedEventType === 'sertanejo' && sertanejoTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Sertanejo"
          templates={sertanejoTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      );
    }
    
    if (selectedEventType === 'baile-funk' && funkTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Baile Funk"
          templates={funkTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      );
    }
    
    if (selectedEventType === 'aniversario' && birthdayTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Aniversário"
          templates={birthdayTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Event-specific templates - shows for specific event type selections */}
      {renderEventBasedSections()}
      
      {/* Personalized Recommendations - based on favorites */}
      {favoritesIds.length > 0 && filteredPageSettings.length > 0 && (
        <TemplateCarousel
          title="Sugeridos para você"
          templates={filteredPageSettings}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
          isRecommended={true}
        />
      )}
      
      {/* Weekly Popular Templates */}
      {filteredWeeklyPopular.length > 0 && (
        <TemplateCarousel
          title="Populares da Semana"
          templates={filteredWeeklyPopular}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
          isWeeklyPopular={true}
        />
      )}
      
      {/* Used By Other Creators */}
      {filteredUsedByCreators.length > 0 && (
        <TemplateCarousel
          title="Usados por outros criadores"
          templates={filteredUsedByCreators}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
          isCreatorUsed={true}
        />
      )}
      
      {/* Recomendado para você / Templates em destaque */}
      {filteredRecommended.length > 0 && (
        <TemplateCarousel 
          title={userPlan === 'ultimate' ? 'Recomendado para você' : 'Templates em destaque'} 
          templates={filteredRecommended}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      )}
      
      {/* Novidades da semana */}
      {filteredNew.length > 0 && (
        <TemplateCarousel 
          title="Novidades da semana" 
          templates={filteredNew}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      )}
      
      {/* Mais acessíveis / Mais baixados */}
      {filteredPopular.length > 0 && (
        <TemplateCarousel 
          title="Mais acessíveis" 
          templates={filteredPopular}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading}
        />
      )}
      
      {/* Ultimate plan exclusive section */}
      {userPlan === 'ultimate' && filteredExclusive.length > 0 && (
        <TemplateCarousel 
          title="Conteúdo Exclusivo Ultimate" 
          templates={filteredExclusive}
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
