
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
import CollectionGallery from './pages/CollectionGallery';
import CollectionDetail from './pages/CollectionDetail';
import Profile from './pages/Profile';
import TeamGallery from './pages/TeamGallery';
import TeamDetail from './pages/TeamDetail';
import TeamEditor from './pages/TeamEditor';
import CommentSection from './components/CommentSection';
import CardGallery from './pages/CardGallery';
import GameDayMode from './pages/GameDayMode';
import MobileLayout from './components/layout/MobileLayout';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MobileLayout><Index /></MobileLayout>} />
          <Route path="/detector" element={<MobileLayout><CardDetector /></MobileLayout>} />
          <Route path="/teams/oakland" element={<MobileLayout><OaklandLanding /></MobileLayout>} />
          <Route path="/teams/oakland/memories" element={<MobileLayout><OaklandMemories /></MobileLayout>} />
          <Route path="/teams/oakland/memories/:id" element={<MobileLayout><OaklandMemoryDetail /></MobileLayout>} />
          <Route path="/teams/oakland/create" element={<MobileLayout><OaklandMemoryCreator /></MobileLayout>} />
          <Route path="/group-memory-creator" element={<MobileLayout><GroupMemoryCreator /></MobileLayout>} />
          <Route path="/editor" element={<MobileLayout><CardEditor /></MobileLayout>} />
          <Route path="/editor/:id" element={<MobileLayout><CardEditor /></MobileLayout>} />
          <Route path="/gallery" element={<MobileLayout><CardGallery /></MobileLayout>} />
          <Route path="/collections" element={<MobileLayout><CollectionGallery /></MobileLayout>} />
          <Route path="/collections/:id" element={<MobileLayout><CollectionDetail /></MobileLayout>} />
          <Route path="/profile" element={<MobileLayout><Profile /></MobileLayout>} />
          <Route path="/teams" element={<MobileLayout><TeamGallery /></MobileLayout>} />
          <Route path="/teams/:id" element={<MobileLayout><TeamDetail /></MobileLayout>} />
          <Route path="/teams/:id/edit" element={<MobileLayout><TeamEditor /></MobileLayout>} />
          <Route path="/comments" element={<MobileLayout><CommentSection /></MobileLayout>} />
          <Route path="/experiences/gameday" element={<GameDayMode />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
