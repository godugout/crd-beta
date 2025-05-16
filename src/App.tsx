
import React from 'react';
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
import MobileOptimizedLayout from './components/layout/MobileOptimizedLayout';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import { UserPreferencesProvider } from './context/UserPreferencesContext';

function App() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if current route needs mobile layout
  const shouldUseMobileLayout = isMobile && !location.pathname.includes('/admin');
  
  // Wrap content in appropriate layout
  const renderWithLayout = (component: React.ReactNode) => {
    if (shouldUseMobileLayout) {
      return <MobileOptimizedLayout>{component}</MobileOptimizedLayout>;
    }
    
    return <ResponsiveLayout>{component}</ResponsiveLayout>;
  };
  
  return (
    <div className="App">
      <UserPreferencesProvider>
        <CardProvider>
          <Routes>
            <Route path="/" element={renderWithLayout(<Home />)} />
            <Route path="/create" element={renderWithLayout(<CardCreator />)} />
            <Route path="/studio" element={<CardStudio />} /> 
            <Route path="/editor" element={renderWithLayout(<Editor />)} />
            <Route path="/editor/:id" element={renderWithLayout(<Editor />)} />
            <Route path="/gallery" element={renderWithLayout(<Gallery />)} />
            <Route path="/card/:id" element={renderWithLayout(<CardView />)} />
            <Route path="/community" element={renderWithLayout(<Community />)} />
            <Route path="/personalize" element={renderWithLayout(<UserPersonalization />)} />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
          <Toaster />
        </CardProvider>
      </UserPreferencesProvider>
    </div>
  );
}

export default App;
