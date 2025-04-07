import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
// Auth
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
// Card Context
import { CardProvider } from './context/CardContext';
// Main Pages
import Index from './pages/Index';
import Gallery from './pages/Gallery';
import CardShowcase from './pages/CardShowcase';
import Editor from './pages/Editor';
import CardDetector from './pages/CardDetector';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import CollectionForm from './pages/CollectionForm';
import NotFound from './pages/NotFound';
// Memory Pack Pages
import MemoryPacks from './pages/MemoryPacks';
import MemoryPackDetail from './pages/MemoryPackDetail';
import MemoryPackCreator from './pages/MemoryPackCreator';
// Oakland Pages
import OaklandLanding from './pages/oakland/OaklandLanding';
import OaklandMemories from './pages/oakland/OaklandMemories';
import OaklandMemoryDetail from './pages/oakland/OaklandMemoryDetail';
import OaklandMemoryCreator from './pages/OaklandMemoryCreator';
// Game Day Mode
import GameDayMode from './pages/GameDayMode';
// Demo Pages
import PbrDemo from './pages/PbrDemo';
import BaseballCardViewer from './pages/BaseballCardViewer';
import SignatureDemo from './pages/SignatureDemo';
import ArCardViewer from './pages/ArCardViewer';
import CardComparison from './pages/CardComparison';
import CardAnimation from './pages/CardAnimation';
// Admin Page
import AdminPage from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CardProvider>
          <Toaster richColors />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/card/:id" element={<CardShowcase />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/card-detector" element={<CardDetector />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/collections/:id/edit" element={<CollectionForm />} />
            <Route path="/collections/new" element={<CollectionForm />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Memory Pack Routes */}
            <Route path="/packs" element={<MemoryPacks />} />
            <Route path="/packs/:id" element={<MemoryPackDetail />} />
            <Route path="/packs/new" element={<MemoryPackCreator />} />
            <Route path="/packs/:id/edit" element={<MemoryPackCreator />} />
            
            {/* Oakland Routes */}
            <Route path="/oakland" element={<OaklandLanding />} />
            <Route path="/oakland/memories" element={<OaklandMemories />} />
            <Route path="/oakland/memories/:id" element={<OaklandMemoryDetail />} />
            <Route path="/oakland/create" element={<OaklandMemoryCreator />} />
            
            {/* Game Day Mode */}
            <Route path="/gameday" element={<GameDayMode />} />
            
            {/* Demo Pages */}
            <Route path="/pbr" element={<PbrDemo />} />
            <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
            <Route path="/signature" element={<SignatureDemo />} />
            <Route path="/ar-card-viewer" element={<ArCardViewer />} />
            <Route path="/card-comparison" element={<CardComparison />} />
            <Route path="/animation" element={<CardAnimation />} />
            
            {/* Admin Page */}
            <Route path="/admin" element={<AdminPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
