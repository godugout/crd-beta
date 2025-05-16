
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import CardCreator from './pages/CardCreator';
import CardStudio from './pages/CardStudio';
import Editor from './pages/Editor';
import Gallery from './pages/Gallery';
import CardView from './pages/CardView';
import Community from './pages/Community';
import Documentation from './pages/Documentation';
import UserPersonalization from './pages/UserPersonalization';

// Providers
import { CardProvider } from './context/CardContext';
import { Toaster } from './components/ui/toaster';
import { useIsMobile } from './hooks/use-mobile';
import { useMobileOptimization } from './hooks/useMobileOptimization';
import MobileOptimizedLayout from './components/layout/MobileOptimizedLayout';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { cn } from './lib/utils';

function App() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { shouldOptimizeAnimations, lazyLoadImages } = useMobileOptimization();
  
  // Setup mobile optimizations
  useEffect(() => {
    // Add class to body for mobile optimization
    document.body.classList.toggle('mobile-optimized', isMobile);
    document.body.classList.toggle('reduce-animations', shouldOptimizeAnimations);
    document.body.classList.toggle('lazy-load-images', lazyLoadImages);
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('mobile-optimized');
      document.body.classList.remove('reduce-animations');
      document.body.classList.remove('lazy-load-images');
    };
  }, [isMobile, shouldOptimizeAnimations, lazyLoadImages]);
  
  // Check if current route needs mobile layout
  const shouldUseMobileLayout = isMobile && !location.pathname.includes('/admin');
  
  // Get any saved user preferences for layout
  const userPreferredLayout = localStorage.getItem('preferred-layout');
  
  // Determine which layout to use based on device and preferences
  const useResponsiveLayout = 
    (!isMobile) || 
    (userPreferredLayout === 'desktop' && !shouldUseMobileLayout);
  
  // Wrap content in appropriate layout
  const renderWithLayout = (component: React.ReactNode) => {
    if (!useResponsiveLayout) {
      return <MobileOptimizedLayout>{component}</MobileOptimizedLayout>;
    }
    
    return <ResponsiveLayout>{component}</ResponsiveLayout>;
  };
  
  return (
    <div className={cn(
      "App",
      isMobile && "touch-optimized",
      shouldOptimizeAnimations && "reduce-motion"
    )}>
      <UserPreferencesProvider>
        <CardProvider>
          <Routes>
            <Route path="/" element={renderWithLayout(<Home />)} />
            <Route path="/create" element={renderWithLayout(<CardCreator />)} />
            <Route path="/studio" element={renderWithLayout(<CardStudio />)} /> 
            <Route path="/editor" element={renderWithLayout(<Editor />)} />
            <Route path="/editor/:id" element={renderWithLayout(<Editor />)} />
            <Route path="/gallery" element={renderWithLayout(<Gallery />)} />
            <Route path="/card/:id" element={renderWithLayout(<CardView />)} />
            <Route path="/community" element={renderWithLayout(<Community />)} />
            <Route path="/personalize" element={renderWithLayout(<UserPersonalization />)} />
            <Route path="/docs" element={renderWithLayout(<Documentation />)} />
          </Routes>
          <Toaster />
        </CardProvider>
      </UserPreferencesProvider>
    </div>
  );
}

export default App;
