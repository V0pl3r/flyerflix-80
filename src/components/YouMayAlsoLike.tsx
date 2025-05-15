
import { useEffect, useState } from 'react';
import { Template } from '../data/templates';
import TemplateCarousel from './TemplateCarousel';

interface YouMayAlsoLikeProps {
  downloads: { templateId: string; downloadDate: string }[];
  allTemplates: Template[];
  onTemplateClick: (template: Template) => void;
  onToggleFavorite: (template: Template) => void;
  favoritesIds: string[];
}

const YouMayAlsoLike = ({ 
  downloads,
  allTemplates,
  onTemplateClick,
  onToggleFavorite,
  favoritesIds
}: YouMayAlsoLikeProps) => {
  const [recommendations, setRecommendations] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get recommended templates based on recent downloads
    const getRecommendations = () => {
      // Exit if no downloads or templates
      if (!downloads.length || !allTemplates.length) {
        setRecommendations([]);
        setIsLoading(false);
        return;
      }

      // Get the most recent downloads (up to 5)
      const recentDownloads = downloads
        .sort((a, b) => new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime())
        .slice(0, 5);

      // Get downloaded templates
      const downloadedTemplates = recentDownloads
        .map(download => allTemplates.find(t => t.id === download.templateId))
        .filter(template => template !== undefined) as Template[];

      // Extract event types and categories from downloaded templates
      const eventTypes = downloadedTemplates.map(t => t.eventType).filter(Boolean);
      const categories = downloadedTemplates.map(t => t.category).filter(Boolean);

      // Find similar templates based on event types and categories
      const similarTemplates = allTemplates.filter(template => 
        // Not in downloaded templates
        !recentDownloads.some(d => d.templateId === template.id) &&
        // Similar by event type or category
        (eventTypes.includes(template.eventType) || categories.includes(template.category))
      );

      // Randomize and limit to 10 templates
      const shuffled = [...similarTemplates].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 10));
      setIsLoading(false);
    };

    getRecommendations();
  }, [downloads, allTemplates]);

  if (!downloads.length || recommendations.length === 0) {
    return null;
  }

  return (
    <TemplateCarousel
      title="Você também pode gostar"
      templates={recommendations}
      onTemplateClick={onTemplateClick}
      onToggleFavorite={onToggleFavorite}
      favoritesIds={favoritesIds}
      showFavoriteButtons={true}
      isLoading={isLoading}
    />
  );
};

export default YouMayAlsoLike;
