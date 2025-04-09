import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Account from '@/pages/Account';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import CardGallery from '@/pages/CardGallery';
import BaseballCard from '@/pages/BaseballCard';
import OaklandPage from '@/pages/OaklandPage';
import GroupMemoryPage from '@/pages/GroupMemoryPage';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { SiteFooter } from '@/components/navigation/SiteFooter';
import { Toaster } from 'sonner';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CardTrainer } from '@/components/experimental/CardTrainer';
import './App.css';

function App() {
  const session = useSession();
  const supabase = useSupabaseClient();
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
    <Router>
      <div className="App">
        <SiteHeader />

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/account"
              element={
                session ? (
                  <Account session={session} />
                ) : (
                  <div className="flex justify-center">
                    <Auth
                      supabaseClient={supabase}
                      appearance={{ theme: ThemeSupa }}
                      providers={['google', 'github']}
                    />
                  </div>
                )
              }
            />
            <Route path="/cards/create" element={<Editor />} />
            <Route path="/cards/edit/:id" element={<Editor />} />
            <Route path="/gallery" element={<CardGallery />} />
            <Route path="/baseball" element={<BaseballCard />} />
            <Route path="/oakland" element={<OaklandPage />} />
            <Route path="/group-memory" element={<GroupMemoryPage />} />
            <Route path="/card-trainer" element={<CardTrainer />} />
          </Routes>
        </main>

        <SiteFooter />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
