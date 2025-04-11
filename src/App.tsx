
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import { routes } from './routes';
import './App.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/hooks/useTheme';

function App() {
  const router = createBrowserRouter(routes);
  
  return (
    <>
      <ThemeProvider>
        <CardEnhancedProvider>
          <RouterProvider router={router} />
        </CardEnhancedProvider>
        <Toaster position="top-center" />
      </ThemeProvider>
    </>
  );
}

export default App;
