
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { CardProvider } from './context/CardContext'; // Fix the import path to use correct file
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import Gallery from '@/pages/Gallery';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <CardProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CardProvider>
    </HelmetProvider>
  );
}

export default App;
