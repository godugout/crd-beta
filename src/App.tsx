
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useMediaQuery } from './hooks/useMediaQuery';
import Index from './pages/Index';
import CardDetector from './pages/CardDetector';
import OaklandLanding from './pages/oakland/OaklandLanding';
import OaklandMemories from './pages/oakland/OaklandMemories';
import OaklandMemoryDetail from './pages/oakland/OaklandMemoryDetail';
import OaklandMemoryCreator from './pages/OaklandMemoryCreator';
import GroupMemoryCreator from './pages/GroupMemoryCreator';
import CardEditor from './components/CardEditor';
import Editor from './pages/Editor';
import CollectionGallery from './pages/CollectionGallery';
import CollectionDetail from './pages/CollectionDetail';
import Profile from './pages/Profile';
import TeamGallery from './pages/TeamGallery';
import TeamDetail from './pages/TeamDetail';
import TeamEditor from './pages/TeamEditor';
import CommentSection from './components/CommentSection';
import CardGallery from './pages/CardGallery';
import CardDetail from './pages/CardDetail';
import GameDayMode from './pages/GameDayMode';
import CommunityFeed from './pages/CommunityFeed';
import Labs from './pages/Labs';
import PbrDemo from './pages/PbrDemo';
import SignatureDemo from './pages/SignatureDemo';
import MobileLayout from './components/layout/MobileLayout';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const routeElements = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/detector" element={<CardDetector />} />
      
      {/* Card routes */}
      <Route path="/cards" element={<CardGallery />} />
      <Route path="/cards/gallery" element={<CardGallery />} />
      <Route path="/cards/create" element={<Editor />} />
      <Route path="/cards/:id" element={<CardDetail />} />
      <Route path="/cards/:id/edit" element={<Editor />} />
      <Route path="/cards/detect" element={<CardDetector />} />
      
      {/* Collection routes */}
      <Route path="/collections" element={<CollectionGallery />} />
      <Route path="/collections/:id" element={<CollectionDetail />} />
      <Route path="/collections/new" element={<CollectionGallery />} />
      
      {/* Team routes */}
      <Route path="/teams" element={<TeamGallery />} />
      <Route path="/teams/:id" element={<TeamDetail />} />
      <Route path="/teams/:id/edit" element={<TeamEditor />} />
      <Route path="/teams/oakland" element={<OaklandLanding />} />
      <Route path="/teams/oakland/memories" element={<OaklandMemories />} />
      <Route path="/teams/oakland/memories/:id" element={<OaklandMemoryDetail />} />
      <Route path="/teams/oakland/create" element={<OaklandMemoryCreator />} />
      
      {/* Community routes */}
      <Route path="/community" element={<CommunityFeed />} />
      <Route path="/comments" element={<CommentSection />} />
      
      {/* User routes */}
      <Route path="/profile" element={<Profile />} />
      
      {/* Special features */}
      <Route path="/group-memory-creator" element={<GroupMemoryCreator />} />
      <Route path="/features/gameday" element={<GameDayMode />} />
      
      {/* Labs routes */}
      <Route path="/labs" element={<Labs />} />
      <Route path="/labs/pbr" element={<PbrDemo />} />
      <Route path="/labs/signature" element={<SignatureDemo />} />
      <Route path="/labs/card-detection" element={<CardDetector />} />
    </Routes>
  );

  return (
    <div className="App min-h-screen bg-background">
      <Router>
        {isMobile ? (
          <MobileLayout>
            {routeElements}
          </MobileLayout>
        ) : (
          routeElements
        )}
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
