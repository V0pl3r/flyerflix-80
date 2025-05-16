
import { createRoot } from 'react-dom/client'
import { lazy, Suspense, useEffect } from 'react'
import { isSlowConnection } from './lib/utils'
import './index.css'
import { initSecurity } from './utils/securityUtils'
import { Skeleton } from '@/components/ui/skeleton'
import AppDefault from './App'
import { addBounceKeyframes } from './utils/animationUtils'

// Initialize security measures
initSecurity();

// Set up global animation keyframes
addBounceKeyframes();

// Optimize loading for slow connections
const App = isSlowConnection() 
  ? lazy(() => import('./App.tsx'))
  : AppDefault;

// Enhanced loader component with animation
const AppLoader = () => {
  useEffect(() => {
    // Add a nice fade-in effect to the loader itself
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
      loaderContainer.classList.add('opacity-0');
      setTimeout(() => {
        loaderContainer.classList.remove('opacity-0');
        loaderContainer.classList.add('transition-opacity', 'duration-700', 'opacity-100');
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center loader-container">
      <div className="text-center transform transition-transform duration-500">
        <div className="mb-6 animate-bounce">
          <h1 className="text-flyerflix-red text-4xl font-bold tracking-tight">FLYERFLIX</h1>
        </div>
        <div className="mb-4">
          <Skeleton className="h-16 w-48 mx-auto rounded-lg bg-white/5 animate-pulse" />
        </div>
        <Skeleton className="h-4 w-64 mx-auto mb-2 bg-white/10" />
        <Skeleton className="h-4 w-40 mx-auto bg-white/10" />
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>
);
