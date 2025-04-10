
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';
import { queryClient } from './lib/api/queryClient';
import { CardProvider } from './context/CardContext';
import { AuthProvider } from './providers/AuthProvider'; // Using one consistent AuthProvider
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { initSentry } from './lib/monitoring/sentry';

// Initialize monitoring
if (import.meta.env.PROD) {
  initSentry();
}

// Make sure we have a valid DOM node before attempting to render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <AuthProvider>
              <CardProvider>
                <App />
                <Toaster position="top-right" />
              </CardProvider>
            </AuthProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
