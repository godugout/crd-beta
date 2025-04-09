
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from './lib/api/queryClient';
import { CardProvider } from './context/CardContext';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CardProvider>
            <App />
          </CardProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
