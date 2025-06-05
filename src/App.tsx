
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CardProvider } from '@/context/CardContext';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';

// Lazy load components
const ImmersiveCardViewerPage = lazy(() => import('@/pages/ImmersiveCardViewerPage'));
const UnifiedCardEditor = lazy(() => import('@/pages/UnifiedCardEditor'));
const CardDetector = lazy(() => import('@/pages/CardDetector'));

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
              <Router>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Navigate to="/card-detector" replace />
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
              </Router>
              <Toaster />
            </div>
          </TooltipProvider>
        </CardEnhancedProvider>
      </CardProvider>
    </QueryClientProvider>
  );
}

export default App;
