
import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Account from './components/Account';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import CardGallery from '@/pages/CardGallery';
import { Toaster } from 'sonner';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import './App.css';

function App() {
  const [scrollPosition, setScrollPosition] = useNavigationState({
    key: 'scrollPosition',
    defaultState: 0,
    sessionOnly: true
  });
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
    }
  }, [scrollPosition]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollPosition]);

  return (
    <div className="App">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-cardshow-blue">Cardshow</Link>
            <div className="space-x-4">
              <Link to="/gallery" className="text-cardshow-dark hover:text-cardshow-blue transition-colors">Gallery</Link>
              <Link to="/cards/create" className="text-cardshow-dark hover:text-cardshow-blue transition-colors">Create</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards/create" element={<Editor />} />
          <Route path="/cards/edit/:id" element={<Editor />} />
          <Route path="/gallery" element={<CardGallery />} />
        </Routes>
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-cardshow-slate">
          <p>© {new Date().getFullYear()} Cardshow. All rights reserved.</p>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
