
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CardViewerPage from './pages/CardViewerPage';
import ImmersiveCardViewerPage from './pages/ImmersiveCardViewerPage';
import { CardProvider } from './context/CardContext';
import { SessionProvider } from './context/SessionContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <SessionProvider>
      <CardProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards/:id" element={<CardViewerPage />} />
          <Route path="/immersive/:id" element={<ImmersiveCardViewerPage />} />
          <Route path="/immersive" element={<ImmersiveCardViewerPage />} />
        </Routes>
        <Toaster position="top-center" />
      </CardProvider>
    </SessionProvider>
  );
}

export default App;
