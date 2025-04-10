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
import GameDayMode from '@/pages/GameDayMode';
import { Toaster } from 'sonner';
import { useNavigationState } from '@/hooks/useNavigationState';
import AppHeader from './components/navigation/AppHeader';
import PageLayout from './components/navigation/PageLayout';
import CardDetail from '@/pages/CardDetail';
import Collections from '@/pages/Collections';
import TeamPage from '@/pages/TeamPage';
import CommunityPage from '@/pages/CommunityPage';
import OaklandLanding from '@/pages/oakland/OaklandLanding';
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import OaklandMemoryCreatorPage from '@/pages/OaklandMemoryCreator';
import { ThemeProvider } from '@/hooks/useTheme';
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
    <ThemeProvider defaultTheme="light">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards/create" element={<Editor />} />
          <Route path="/cards/edit/:id" element={<Editor />} />
          <Route path="/gallery" element={<CardGallery />} />
          <Route path="/cards" element={<CardGallery />} />
          <Route path="/cards/:id" element={<CardDetail />} />
          <Route path="/detector" element={<CardDetector />} />
          <Route path="/ar-viewer" element={<ArCardViewer />} />
          <Route path="/ar-viewer/:id" element={<ArCardViewer />} />
          <Route path="/comparison" element={<CardComparison />} />
          <Route path="/animation" element={<CardAnimation />} />
          <Route path="/cards/effects" element={<CardAnimation />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/create" element={<PageLayout title="Create Collection"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Create a New Collection</h1>
            <p className="mb-6">Organize your cards into themed collections</p>
            {/* Collection creation form will be implemented here */}
            <div className="bg-white dark:bg-litmus-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-center text-gray-500 dark:text-gray-400">Collection creation functionality coming soon</p>
            </div>
          </div></PageLayout>} />
          <Route path="/collections/featured" element={<PageLayout title="Featured Collections"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Featured Collections</h1>
            <p className="mb-6">Discover curated collections from the community</p>
            {/* Featured collections will be displayed here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="h-40 bg-gray-100"></div>
                  <div className="p-4">
                    <h3 className="font-medium">Featured Collection {i}</h3>
                    <p className="text-sm text-gray-600">Coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div></PageLayout>} />
          <Route path="/packs" element={<PageLayout title="Memory Packs"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Memory Packs</h1>
            <p className="mb-6">Themed collections of memories</p>
            {/* Memory packs will be displayed here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="h-40 bg-gray-100"></div>
                  <div className="p-4">
                    <h3 className="font-medium">Memory Pack {i}</h3>
                    <p className="text-sm text-gray-600">Coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div></PageLayout>} />
          <Route path="/packs/create" element={<PageLayout title="Create Memory Pack"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Create Memory Pack</h1>
            <p className="mb-6">Build your own themed memory pack</p>
            {/* Memory pack creation form will be implemented here */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-center text-gray-500">Memory pack creation functionality coming soon</p>
            </div>
          </div></PageLayout>} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
          
          {/* Oakland specific routes */}
          <Route path="/oakland-landing" element={<OaklandLanding />} />
          <Route path="/oakland-memories" element={<OaklandMemories />} />
          <Route path="/oakland-memories/:id" element={<OaklandMemoryDetail />} />
          <Route path="/oakland-memory-creator" element={<OaklandMemoryCreatorPage />} />
          <Route path="/oakland" element={<OaklandLanding />} />
          
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/game-day" element={<GameDayMode />} />
          <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
          <Route path="/admin" element={<PageLayout title="Admin"><div>Admin Page</div></PageLayout>} />
          <Route path="/labs" element={<PageLayout title="Dugout Labs"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Dugout Labs</h1>
            <p className="mb-6">Experimental features and beta testing</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold mb-3 text-amber-600">AR Features</h2>
                <p className="mb-4">Preview our upcoming AR experiences</p>
                <a href="/ar-viewer" className="text-blue-600 hover:underline">Try AR Viewer →</a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold mb-3 text-amber-600">Card Effects</h2>
                <p className="mb-4">Test our newest card visual effects</p>
                <a href="/animation" className="text-blue-600 hover:underline">Try Card Effects →</a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold mb-3 text-amber-600">Group Memory</h2>
                <p className="mb-4">Create shared memory collections</p>
                <a href="/group-memory" className="text-blue-600 hover:underline">Try Group Memory →</a>
              </div>
            </div>
          </div></PageLayout>} />
          <Route path="/experimental" element={<PageLayout title="Experimental Features"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Experimental Features</h1>
            <p className="mb-6">Try out our newest features still in development</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold mb-3 text-amber-600">Card Detection</h2>
                <p className="mb-4">Detect and digitize physical cards</p>
                <a href="/detector" className="text-blue-600 hover:underline">Try Card Detection →</a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold mb-3 text-amber-600">Card Comparison</h2>
                <p className="mb-4">Compare cards side by side</p>
                <a href="/comparison" className="text-blue-600 hover:underline">Try Card Comparison →</a>
              </div>
            </div>
          </div></PageLayout>} />
          <Route path="/group-memory" element={<PageLayout title="Group Memory"><div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Group Memory</h1>
            <p className="mb-6">Create and share memories with groups</p>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-center text-gray-500">Group Memory feature coming soon</p>
            </div>
          </div></PageLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" theme="system" />
      </div>
    </ThemeProvider>
  );
}

export default App;
