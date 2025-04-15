import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CardDetail from './pages/CardDetail';
import CardCreation from './pages/CardCreation';
import CardViewerExperimental from './pages/CardViewerExperimental';
import ImmersiveCardViewerDemo from './pages/ImmersiveCardViewerDemo';
import { CardProvider } from './context/CardContext';
import { ToastContainer } from 'sonner';
import CardDetailPage from './pages/CardDetailPage';
import ImmersiveViewer from './pages/ImmersiveViewer';

function App() {
  return (
    <CardProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/card/:id" element={<CardDetailPage />} />
          <Route path="/immersive-viewer/:id?" element={<ImmersiveViewer />} />
          <Route path="/create" element={<CardCreation />} />
          <Route path="/labs/card-viewer/:id" element={<CardViewerExperimental />} />
          <Route path="/labs/immersive-viewer/:id?" element={<ImmersiveCardViewerDemo />} />
        </Routes>
      </Router>
    </CardProvider>
  );
}

export default App;
