
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/auth/AuthProvider';
import { CardProvider } from './context/CardContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CardProvider>
          <App />
        </CardProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
