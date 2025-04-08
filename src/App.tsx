
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
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
import MobileLayout from './components/layout/MobileLayout';
import CommunityFeed from './pages/CommunityFeed';
import Labs from './pages/Labs';
import PbrDemo from './pages/PbrDemo';
import SignatureDemo from './pages/SignatureDemo';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MobileLayout><Index /></MobileLayout>} />
          <Route path="/detector" element={<MobileLayout><CardDetector /></MobileLayout>} />
          
          {/* Card routes */}
          <Route path="/cards" element={<MobileLayout><CardGallery /></MobileLayout>} />
          <Route path="/cards/gallery" element={<MobileLayout><CardGallery /></MobileLayout>} />
          <Route path="/cards/create" element={<MobileLayout><Editor /></MobileLayout>} />
          <Route path="/cards/:id" element={<MobileLayout><CardDetail /></MobileLayout>} />
          <Route path="/cards/:id/edit" element={<MobileLayout><Editor /></MobileLayout>} />
          <Route path="/cards/detect" element={<MobileLayout><CardDetector /></MobileLayout>} />
          
          {/* Collection routes */}
          <Route path="/collections" element={<MobileLayout><CollectionGallery /></MobileLayout>} />
          <Route path="/collections/:id" element={<MobileLayout><CollectionDetail /></MobileLayout>} />
          <Route path="/collections/new" element={<MobileLayout><CollectionGallery /></MobileLayout>} />
          
          {/* Team routes */}
          <Route path="/teams" element={<MobileLayout><TeamGallery /></MobileLayout>} />
          <Route path="/teams/:id" element={<MobileLayout><TeamDetail /></MobileLayout>} />
          <Route path="/teams/:id/edit" element={<MobileLayout><TeamEditor /></MobileLayout>} />
          <Route path="/teams/oakland" element={<MobileLayout><OaklandLanding /></MobileLayout>} />
          <Route path="/teams/oakland/memories" element={<MobileLayout><OaklandMemories /></MobileLayout>} />
          <Route path="/teams/oakland/memories/:id" element={<MobileLayout><OaklandMemoryDetail /></MobileLayout>} />
          <Route path="/teams/oakland/create" element={<MobileLayout><OaklandMemoryCreator /></MobileLayout>} />
          
          {/* Community routes */}
          <Route path="/community" element={<MobileLayout><CommunityFeed /></MobileLayout>} />
          <Route path="/comments" element={<MobileLayout><CommentSection /></MobileLayout>} />
          
          {/* User routes */}
          <Route path="/profile" element={<MobileLayout><Profile /></MobileLayout>} />
          
          {/* Special features */}
          <Route path="/group-memory-creator" element={<MobileLayout><GroupMemoryCreator /></MobileLayout>} />
          <Route path="/features/gameday" element={<MobileLayout><GameDayMode /></MobileLayout>} />
          <Route path="/features/ar-viewer" element={<MobileLayout><Index /></MobileLayout>} />
          <Route path="/features/baseball-viewer" element={<MobileLayout><Index /></MobileLayout>} />
          <Route path="/features/card-comparison" element={<MobileLayout><Index /></MobileLayout>} />
          <Route path="/features/animation" element={<MobileLayout><Index /></MobileLayout>} />
          
          {/* Labs routes */}
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/pbr" element={<MobileLayout><PbrDemo /></MobileLayout>} />
          <Route path="/labs/signature" element={<MobileLayout><SignatureDemo /></MobileLayout>} />
          <Route path="/labs/card-detection" element={<MobileLayout><CardDetector /></MobileLayout>} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
