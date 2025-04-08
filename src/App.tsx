
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CollectionDetail from './pages/CollectionDetail';
import Editor from './pages/Editor';
import OaklandMemoryCreator from './pages/OaklandMemoryCreator';
import GroupMemoryCreator from './pages/GroupMemoryCreator';
import DigitalAssetManager from './pages/DigitalAssetManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/collection/:id" element={<CollectionDetail />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/oakland/create" element={<OaklandMemoryCreator />} />
        <Route path="/memories/group" element={<GroupMemoryCreator />} />
        <Route path="/assets" element={<DigitalAssetManager />} />
        <Route path="/" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
