
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/useTheme';
import { CardProvider } from '@/context/CardContext';
import { AuthProvider } from '@/context/auth/AuthProvider';

// Pages
import Index from '@/pages/Index'; // Oakland landing page
import CardGallery from '@/components/CardGallery';
import CardViewerPage from '@/components/CardViewerPage';
import Account from '@/components/Account';
import AuthPage from '@/components/auth/AuthPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Route collections
import { teamRoutes } from '@/routes/teamRoutes';
import { townRoutes } from '@/routes/townRoutes';
import { oaklandRoutes } from '@/routes/oakland';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CardProvider>
            <div className="min-h-screen bg-background">
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
              <Toaster />
            </div>
          </CardProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
