
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import CardGallery from '@/pages/CardGallery';
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
        <Route path="/admin" element={<PageLayout title="Admin"><div>Admin Page</div></PageLayout>} />
        <Route path="*" element={
          <PageLayout title="Page Not Found">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
              <p className="mt-4">The page you're looking for doesn't exist.</p>
            </div>
          </PageLayout>
        } />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
