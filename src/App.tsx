
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/hooks/useTheme';
import { initSentry } from '@/lib/monitoring/sentry';
import './App.css';

// Initialize monitoring on app start
if (import.meta.env.PROD) {
  initSentry();
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme="system" />
    </ThemeProvider>
  );
}

export default App;
