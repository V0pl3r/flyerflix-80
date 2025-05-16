import { useState, useEffect } from 'react';
import TemplateCarousel from './TemplateCarousel';
import { Template } from '../data/templates';
import { EventType } from './TemplateFilters';

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
  onPreviewTemplate: (template: Template) => void;
  favoritesIds: string[];
  selectedEventType: EventType;
  personalizedRecommendations: Template[];
  isLoading?: boolean;
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
  onPreviewTemplate,
  favoritesIds,
  selectedEventType,
  personalizedRecommendations,
  isLoading
}: TemplateCategoriesProps) => {
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  useEffect(() => {
    // Simulate a short loading time for better UX
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedEventType]);

  // Filter templates based on selected event type
  const filterByEventType = (templates: Template[] = []) => {
    if (!templates || selectedEventType === 'all') return templates;
    return templates.filter(template => template.eventType === selectedEventType);
  };

  // Filter all template collections by the selected event type
  const filteredRecommended = filterByEventType(recommendedTemplates);
  const filteredNew = filterByEventType(newTemplates);
  const filteredPopular = filterByEventType(popularTemplates);
  const filteredExclusive = filterByEventType(exclusiveTemplates);
  const filteredWeeklyPopular = filterByEventType(weeklyPopularTemplates);
  const filteredUsedByCreators = filterByEventType(usedByCreatorsTemplates);
  const filteredPersonalizedRecommendations = filterByEventType(personalizedRecommendations);

  // Custom section rendering based on event type selection
  const renderEventBasedSections = () => {
    if (selectedEventType === 'pagode' && pagodeTemplates && pagodeTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Pagode"
          templates={pagodeTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    if (selectedEventType === 'sertanejo' && sertanejoTemplates && sertanejoTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Sertanejo"
          templates={sertanejoTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    if (selectedEventType === 'baile-funk' && funkTemplates && funkTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Baile Funk"
          templates={funkTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    if (selectedEventType === 'aniversario' && birthdayTemplates && birthdayTemplates.length > 0) {
      return (
        <TemplateCarousel
          title="Templates para Aniversário"
          templates={birthdayTemplates}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    return null;
  };

  // Dynamic ordering of sections based on selected event type
  const renderTemplateCarousels = () => {
    const sections = [];
    
    // Always show event-specific templates first when filtering
    if (selectedEventType !== 'all') {
      const eventBasedSection = renderEventBasedSections();
      if (eventBasedSection) {
        sections.push(eventBasedSection);
      }
    }
    
    // Personalized recommendations - based on favorites
    if (filteredPersonalizedRecommendations && filteredPersonalizedRecommendations.length > 0) {
      sections.push(
        <TemplateCarousel
          key="personalized"
          title="Sugeridos para você"
          templates={filteredPersonalizedRecommendations}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
          isRecommended={true}
        />
      );
    }
    
    // Weekly Popular Templates
    if (filteredWeeklyPopular && filteredWeeklyPopular.length > 0) {
      sections.push(
        <TemplateCarousel
          key="weeklyPopular"
          title="Populares da Semana"
          templates={filteredWeeklyPopular}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
          isWeeklyPopular={true}
        />
      );
    }
    
    // Used By Other Creators
    if (filteredUsedByCreators && filteredUsedByCreators.length > 0) {
      sections.push(
        <TemplateCarousel
          key="usedByCreators"
          title="Usados por outros criadores"
          templates={filteredUsedByCreators}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
          isCreatorUsed={true}
        />
      );
    }
    
    // Recommended for you / Featured templates
    if (filteredRecommended && filteredRecommended.length > 0) {
      sections.push(
        <TemplateCarousel 
          key="recommended"
          title={userPlan === 'ultimate' ? 'Recomendado para você' : 'Templates em destaque'} 
          templates={filteredRecommended}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    // New templates of the week
    if (filteredNew && filteredNew.length > 0) {
      sections.push(
        <TemplateCarousel 
          key="new"
          title="Novidades da semana" 
          templates={filteredNew}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    // Most accessible/downloaded
    if (filteredPopular && filteredPopular.length > 0) {
      sections.push(
        <TemplateCarousel 
          key="popular"
          title="Mais acessíveis" 
          templates={filteredPopular}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    // Ultimate plan exclusive section
    if (userPlan === 'ultimate' && filteredExclusive && filteredExclusive.length > 0) {
      sections.push(
        <TemplateCarousel 
          key="exclusive"
          title="Conteúdo Exclusivo Ultimate" 
          templates={filteredExclusive}
          isPremiumSection={true}
          onTemplateClick={onTemplateClick}
          onToggleFavorite={onToggleFavorite}
          favoritesIds={favoritesIds}
          showFavoriteButtons={true}
          isLoading={isLoading || isLocalLoading}
        />
      );
    }
    
    if (selectedEventType === 'all') {
      // For homepage, add event-based templates at the end
      const eventBasedSection = renderEventBasedSections();
      if (eventBasedSection) {
        sections.push(eventBasedSection);
      }
    }
    
    return sections;
  };

  return (
    <div className="space-y-2">
      {renderTemplateCarousels()}
    </div>
  );
};

export default TemplateCategories;
