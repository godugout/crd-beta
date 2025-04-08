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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/detector" element={<CardDetector />} />
          <Route path="/teams/oakland" element={<OaklandLanding />} />
          <Route path="/teams/oakland/memories" element={<OaklandMemories />} />
          <Route path="/teams/oakland/memories/:id" element={<OaklandMemoryDetail />} />
          <Route path="/teams/oakland/create" element={<OaklandMemoryCreator />} />
          <Route path="/group-memory-creator" element={<GroupMemoryCreator />} />
          <Route path="/editor" element={<CardEditor />} />
          <Route path="/editor/:id" element={<CardEditor />} />
          <Route path="/gallery" element={<CardGallery />} />
          <Route path="/collections" element={<CollectionGallery />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teams" element={<TeamGallery />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/teams/:id/edit" element={<TeamEditor />} />
          <Route path="/comments" element={<CommentSection />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
