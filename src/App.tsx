
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { CardProvider } from './context/CardContext';
import { CardEnhancedProvider } from './context/CardEnhancedProvider';

// Core pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CardEditor from './pages/CardEditor';
import CardDetail from './pages/CardDetail';
import NotFound from './pages/NotFound';
import Collections from './pages/Collections';
import CardGallery from './pages/CardGallery';
import CollectionDetail from './pages/CollectionDetail';

// Lab features
import Labs from './pages/Labs';
import CardViewerExperimental from './pages/CardViewerExperimental';
import ArCardViewer from './pages/ArCardViewer';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cardshow-theme">
      <CardProvider>
        <CardEnhancedProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/cards" element={<CardGallery />} />
              <Route path="/cards/:id" element={<CardDetail />} />
              <Route path="/cards/create" element={<CardEditor />} />
              <Route path="/cards/edit/:id" element={<CardEditor />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              
              {/* Lab Features */}
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs/card-viewer/:id" element={<CardViewerExperimental />} />
              <Route path="/ar-card-viewer/:id" element={<ArCardViewer />} />
              <Route path="/ar-viewer" element={<ArCardViewer />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
          <SonnerToaster position="top-center" />
        </CardEnhancedProvider>
      </CardProvider>
    </ThemeProvider>
  );
}

export default App;
