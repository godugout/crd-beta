
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TeamThemeProvider } from '@/context/ThemeContext';
import { CardProvider } from '@/context/CardContext';
import { Toaster } from '@/components/ui/toaster';
import { mainRoutes } from '@/routes/mainRoutes';
import { cardRoutes } from '@/routes/cardRoutes';
import { collectionRoutes } from '@/routes/collectionRoutes';

function App() {
  return (
    <TeamThemeProvider>
      <CardProvider>
        <BrowserRouter>
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
        </BrowserRouter>
        <Toaster />
      </CardProvider>
    </TeamThemeProvider>
  );
}

export default App;
