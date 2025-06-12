
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { CardProvider } from '@/context/CardContext';
import { AuthProvider } from '@/context/auth/AuthProvider';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/context/auth/AuthProvider';

// Components
import AuthLoadingIndicator from '@/components/auth/AuthLoadingIndicator';
import StreamlinedNavbar from '@/components/navigation/StreamlinedNavbar';
import FloatingActionButton from '@/components/navigation/FloatingActionButton';
import MobileBottomNavigation from '@/components/navigation/MobileBottomNavigation';

// Pages
import Index from '@/pages/Index';
import CardGallery from '@/components/CardGallery';
import CardViewerPage from '@/components/CardViewerPage';
import Account from '@/components/Account';
import AuthPage from '@/components/auth/AuthPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Route collections
import { teamRoutes } from '@/routes/teamRoutes';
import { townRoutes } from '@/routes/townRoutes';
import { oaklandRoutes } from '@/routes/oakland';
import { cardRoutes } from '@/routes/cardRoutes';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  useKeyboardShortcuts();
  const { isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <AuthLoadingIndicator isLoading={isLoading} />
      <StreamlinedNavbar />
      
      <main className="pb-20 md:pb-0">
        <Routes>
          {/* Home - Oakland Landing Page */}
          <Route path="/" element={<Index />} />
          
          {/* Authentication */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Gallery and Card Viewing */}
          <Route path="/gallery" element={<CardGallery />} />
          <Route path="/card/:id" element={<CardViewerPage />} />
          
          {/* Account (Protected) */}
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          
          {/* Card Routes */}
          {cardRoutes.map((route, index) => (
            <Route 
              key={`card-${index}`} 
              path={route.path} 
              element={route.element} 
            />
          ))}
          
          {/* Team Routes */}
          {teamRoutes.map((route, index) => (
            <Route 
              key={`team-${index}`} 
              path={route.path} 
              element={route.element} 
            />
          ))}
          
          {/* Town Routes */}
          {townRoutes.map((route, index) => (
            <Route 
              key={`town-${index}`} 
              path={route.path} 
              element={route.element} 
            />
          ))}
          
          {/* Oakland Routes */}
          {oaklandRoutes.map((route, index) => (
            <Route 
              key={`oakland-${index}`} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Routes>
      </main>
      
      <FloatingActionButton />
      <MobileBottomNavigation />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CardProvider>
          <AppContent />
        </CardProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
