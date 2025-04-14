
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { queryClient } from './lib/api/queryClient';
import { CardProvider } from './context/CardContext';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './hooks/useTheme';

// Make sure we have a valid DOM node before attempting to render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="system">
            <CardProvider>
              <AuthProvider autoLogin={true}>
                <App />
              </AuthProvider>
            </CardProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
