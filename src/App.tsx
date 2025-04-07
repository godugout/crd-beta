
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Gallery from './pages/Gallery';
import Editor from './pages/Editor';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import CollectionForm from './pages/CollectionForm';
import NotFound from './pages/NotFound';
import PbrDemo from './pages/PbrDemo';
import SignatureDemo from './pages/SignatureDemo';
import CardDetector from './pages/CardDetector';
import BaseballCardViewer from './pages/BaseballCardViewer';
import ArCardViewer from './pages/ArCardViewer';
import CardComparison from './pages/CardComparison';
import CardAnimation from './pages/CardAnimation';
import CardShowcase from './pages/CardShowcase';
import OaklandMemories from './pages/OaklandMemories';
import OaklandMemoryCreator from './pages/OaklandMemoryCreator';
import OaklandMemoryDetail from './pages/OaklandMemoryDetail';
import OaklandLanding from './pages/OaklandLanding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardShowcase />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/collections/new" element={<CollectionForm />} />
        <Route path="/collections/:id/edit" element={<CollectionForm />} />
        <Route path="/pbr" element={<PbrDemo />} />
        <Route path="/signature" element={<SignatureDemo />} />
        <Route path="/card-detector" element={<CardDetector />} />
        <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
        <Route path="/baseball-card-viewer/:id" element={<BaseballCardViewer />} />
        <Route path="/ar-card-viewer" element={<ArCardViewer />} />
        <Route path="/ar-card-viewer/:id" element={<ArCardViewer />} />
        <Route path="/card-comparison" element={<CardComparison />} />
        <Route path="/card-animation" element={<CardAnimation />} />
        <Route path="/showcase" element={<CardShowcase />} />
        <Route path="/oakland" element={<OaklandLanding />} />
        <Route path="/oakland-memories" element={<OaklandMemories />} />
        <Route path="/oakland-memories/create" element={<OaklandMemoryCreator />} />
        <Route path="/oakland-memories/:id" element={<OaklandMemoryDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
