
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import { routes } from './routes';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  const router = createBrowserRouter(routes);
  
  return (
    <>
      <CardEnhancedProvider>
        <RouterProvider router={router} />
      </CardEnhancedProvider>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
