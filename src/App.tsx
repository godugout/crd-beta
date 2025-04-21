
import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { CardProvider } from './context/CardContext';
import { routes } from './routes';
import NotFound from '@/pages/NotFound';

function App() {
  // Use the centralized routes configuration
  const routeElements = useRoutes(routes);
  
  return (
    <HelmetProvider>
      <CardProvider>
        <Toaster position="top-right" />
        {routeElements || <NotFound />}
      </CardProvider>
    </HelmetProvider>
  );
}

export default App;
