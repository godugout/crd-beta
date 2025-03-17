
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Gallery from './pages/Gallery';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import SignatureDemo from './pages/SignatureDemo';
import CollectionDetail from './pages/CollectionDetail';
import Collections from './pages/Collections';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/signature" element={<SignatureDemo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
