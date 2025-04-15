
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CardStateProvider } from './lib/state/providers/CardStateProvider';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CardDetail from './pages/CardDetail';
import CardViewerExperimental from './pages/CardViewerExperimental';
import ImmersiveCardViewerDemo from './pages/ImmersiveCardViewerDemo';
import { CardProvider } from './context/CardContext';
import { Toaster } from 'sonner';
import ImmersiveViewer from './pages/ImmersiveViewer';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cardshow-theme">
      <AuthProvider>
        <CardStateProvider>
          <Router>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/card/:id" element={<CardDetail />} />
              <Route path="/immersive-viewer/:id?" element={<ImmersiveViewer />} />
              <Route path="/labs/card-viewer/:id" element={<CardViewerExperimental />} />
              <Route path="/labs/immersive-viewer/:id?" element={<ImmersiveCardViewerDemo />} />
            </Routes>
          </Router>
        </CardStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
