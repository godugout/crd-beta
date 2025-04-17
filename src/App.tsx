
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TeamThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
// Import as default since it's now exported as both default and named export
import mainRoutes, { mainRoutes as namedMainRoutes } from '@/routes/mainRoutes';
import { cardRoutes } from '@/routes/cardRoutes';
import { collectionRoutes } from '@/routes/collectionRoutes';

function App() {
  return (
    <TeamThemeProvider>
      {/* Removed the duplicate CardProvider since it's already in main.tsx */}
      <Routes>
        {/* Main routes */}
        {mainRoutes.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
        
        {/* Card routes */}
        {cardRoutes.map((route, index) => (
          <Route 
            key={`card-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
        
        {/* Collection routes */}
        {collectionRoutes.map((route, index) => (
          <Route 
            key={`collection-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      <Toaster />
    </TeamThemeProvider>
  );
}

export default App;
