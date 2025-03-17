
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CardProvider } from './context/CardContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CardProvider>
      <App />
    </CardProvider>
  </AuthProvider>
);
