
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Gallery from './pages/Gallery';
import Editor from './pages/Editor';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import NotFound from './pages/NotFound';
import PbrDemo from './pages/PbrDemo';
import SignatureDemo from './pages/SignatureDemo';
import CardDetector from './pages/CardDetector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/pbr" element={<PbrDemo />} />
        <Route path="/signature" element={<SignatureDemo />} />
        <Route path="/card-detector" element={<CardDetector />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
