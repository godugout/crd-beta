
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CardProvider } from '@/context/CardContext';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';

// Lazy load components
const ImmersiveCardViewerPage = lazy(() => import('@/pages/ImmersiveCardViewerPage'));
const UnifiedCardEditor = lazy(() => import('@/pages/UnifiedCardEditor'));
const CardDetector = lazy(() => import('@/pages/CardDetector'));
const Index = lazy(() => import('@/pages/Index'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Labs = lazy(() => import('@/pages/Labs'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CardProvider>
        <CardEnhancedProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Index />
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
                <Route 
                  path="/editor" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <UnifiedCardEditor />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/editor/:id" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <UnifiedCardEditor />
                    </Suspense>
                  } 
                />
              </Routes>
              <Toaster />
            </div>
          </TooltipProvider>
        </CardEnhancedProvider>
      </CardProvider>
    </QueryClientProvider>
  );
}

export default App;
