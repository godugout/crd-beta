
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CardProvider } from '@/context/CardContext';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import { AuthProvider } from '@/context/auth/AuthProvider';
import { oaklandRoutes } from '@/routes/oakland';

// Import Oakland theme CSS
import '@/styles/oakland-theme.css';

// Lazy load components
const ImmersiveCardViewerPage = lazy(() => import('@/pages/ImmersiveCardViewerPage'));
const UnifiedCardEditor = lazy(() => import('@/pages/UnifiedCardEditor'));
const CardDetector = lazy(() => import('@/pages/CardDetector'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Labs = lazy(() => import('@/pages/Labs'));
const AuthPage = lazy(() => import('@/components/auth/AuthPage'));
const OaklandHomepage = lazy(() => import('@/components/oakland/OaklandHomepage'));
const OaklandMemoryCreator = lazy(() => import('@/components/oakland/OaklandMemoryCreator'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-oakland-primary">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mb-4"></div>
      <div className="text-white font-display">Loading...</div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CardProvider>
          <CardEnhancedProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <OaklandHomepage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/auth" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AuthPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/oakland/create" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <OaklandMemoryCreator />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/gallery" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Gallery />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/labs" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Labs />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/card-detector" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CardDetector />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/viewer" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ImmersiveCardViewerPage />
                      </Suspense>
                    } 
                  />
                  
                  {/* Redirect all create/editor paths to Oakland Memory Creator */}
                  <Route path="/create" element={<Navigate to="/oakland/create" replace />} />
                  <Route path="/editor" element={<Navigate to="/oakland/create" replace />} />
                  <Route path="/editor/:id" element={<Navigate to="/oakland/create" replace />} />
                  
                  {/* Oakland routes */}
                  {oaklandRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Routes>
                <Toaster />
              </div>
            </TooltipProvider>
          </CardEnhancedProvider>
        </CardProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
