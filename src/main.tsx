
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CardProvider } from './context/CardContext';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <CardProvider>
        <App />
      </CardProvider>
    </AuthProvider>
  </HelmetProvider>
);
