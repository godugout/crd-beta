
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import CardGallery from '@/pages/CardGallery';
import CardDetector from '@/pages/CardDetector';
import ArCardViewer from '@/pages/ArCardViewer';
import CardComparison from '@/pages/CardComparison';
import CardAnimation from '@/pages/CardAnimation';
import BaseballCardViewer from '@/pages/BaseballCardViewer';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'sonner';
import { useNavigationState } from '@/hooks/useNavigationState';
import AppHeader from './components/navigation/AppHeader';
import PageLayout from './components/navigation/PageLayout';
import './App.css';

function App() {
  const [scrollPosition, setScrollPosition] = useNavigationState({
    key: 'scrollPosition',
    defaultState: 0,
    sessionOnly: true
  });

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards/create" element={<Editor />} />
        <Route path="/cards/edit/:id" element={<Editor />} />
        <Route path="/gallery" element={<CardGallery />} />
        <Route path="/cards" element={<CardGallery />} />
        <Route path="/detector" element={<CardDetector />} />
        <Route path="/ar-viewer" element={<ArCardViewer />} />
        <Route path="/comparison" element={<CardComparison />} />
        <Route path="/animation" element={<CardAnimation />} />
        <Route path="/cards/effects" element={<CardAnimation />} />
        <Route path="/collections" element={<PageLayout title="Collections"><div>Collections Page</div></PageLayout>} />
        <Route path="/collections/create" element={<PageLayout title="Create Collection"><div>Create Collection Page</div></PageLayout>} />
        <Route path="/collections/featured" element={<PageLayout title="Featured Collections"><div>Featured Collections Page</div></PageLayout>} />
        <Route path="/packs" element={<PageLayout title="Memory Packs"><div>Memory Packs Page</div></PageLayout>} />
        <Route path="/teams" element={<PageLayout title="Teams"><div>Teams Page</div></PageLayout>} />
        <Route path="/teams/oakland" element={<PageLayout title="Oakland A's"><div>Oakland A's Team Page</div></PageLayout>} />
        <Route path="/teams/sf-giants" element={<PageLayout title="San Francisco Giants"><div>SF Giants Team Page</div></PageLayout>} />
        <Route path="/game-day" element={<PageLayout title="Game Day Mode"><div>Game Day Mode</div></PageLayout>} />
        <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
        <Route path="/admin" element={<PageLayout title="Admin"><div>Admin Page</div></PageLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
