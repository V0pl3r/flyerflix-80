
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image optimization for low connection
export function optimizeImageUrl(url: string, quality: number = 80, width: number = 0): string {
  if (!url) return '';
  
  // If it's already an optimized URL or local asset, return as is
  if (url.includes('quality=') || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // For unsplash images, use their API
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();
    params.append('q', quality.toString());
    if (width > 0) params.append('w', width.toString());
    params.append('auto', 'format');
    return `${baseUrl}?${params.toString()}`;
  }
  
  // For other remote images that support query parameters
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.append('quality', quality.toString());
    if (width > 0) urlObj.searchParams.append('width', width.toString());
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, return original
    return url;
  }
}

// Lazy loading detection
export function supportsLazyLoading(): boolean {
  return 'loading' in HTMLImageElement.prototype;
}

// Detect slow connections
export function isSlowConnection(): boolean {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
                    
  if (connection) {
    // Network Information API available
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.saveData === true;
  }
  
  // Fallback detection based on user agent (less reliable)
  const userAgent = navigator.userAgent;
  return userAgent.includes('2G') || userAgent.includes('Edge/');
}
