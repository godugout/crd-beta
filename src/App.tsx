
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import { routes } from './routes';
import './App.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/providers/AuthProvider';

function App() {
  const router = createBrowserRouter(routes);
  
  return (
    <>
      <ThemeProvider>
        <AuthProvider autoLogin={true}>
          <CardEnhancedProvider>
            <RouterProvider router={router} />
          </CardEnhancedProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </ThemeProvider>
    </>
  );
}

export default App;
