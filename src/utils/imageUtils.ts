
// Utility functions for image handling

/**
 * Check if an image URL is valid and add error handling
 * @param imageUrl The URL of the image to check
 * @returns A safe image URL with fallback
 */
export const getSafeImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '/placeholder.svg'; // Default placeholder
  }
  return imageUrl;
};

/**
 * Preload important images to improve perceived performance
 * @param imageUrls Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]): void => {
  imageUrls.forEach(url => {
    if (url && url !== '/placeholder.svg') {
      const img = new Image();
      img.src = getSafeImageUrl(url);
    }
  });
};

/**
 * Handle image loading error by replacing with a placeholder
 * @param event The error event from the img element
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>): void => {
  const target = event.target as HTMLImageElement;
  target.src = '/placeholder.svg';
  target.classList.add('error-image');
};
