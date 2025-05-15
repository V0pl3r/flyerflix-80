
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import { isSlowConnection } from './lib/utils'
import './index.css'
import { initSecurity } from './utils/securityUtils'
import { Skeleton } from '@/components/ui/skeleton'

// Initialize security measures
initSecurity();

// Optimize loading for slow connections
const App = isSlowConnection() 
  ? lazy(() => import('./App.tsx'))
  : require('./App.tsx').default;

// Loader component
const AppLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="mb-4">
        <Skeleton className="h-16 w-48 mx-auto rounded-lg" />
      </div>
      <Skeleton className="h-4 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>
);
