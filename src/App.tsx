
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import PageLayout from './components/navigation/PageLayout';

// Auth
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';

// Card Context
import { CardProvider } from './context/CardContext';

// Main Pages
import Index from './pages/Index';
import Gallery from './pages/Gallery';
import CardShowcase from './pages/CardShowcase';
import Editor from './pages/Editor';
import CardDetector from './pages/CardDetector';
import NotFound from './pages/NotFound';

// Collections Pages
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import CollectionForm from './pages/CollectionForm';

// Memory Pack Pages
import MemoryPacks from './pages/MemoryPacks';
import MemoryPackDetail from './pages/MemoryPackDetail';
import MemoryPackCreator from './pages/MemoryPackCreator';

// Oakland Pages
import OaklandLanding from './pages/oakland/OaklandLanding';
import OaklandMemories from './pages/oakland/OaklandMemories';
import OaklandMemoryDetail from './pages/oakland/OaklandMemoryDetail';
import OaklandMemoryCreator from './pages/OaklandMemoryCreator';

// Game Day Mode
import GameDayMode from './pages/GameDayMode';

// Demo Pages
import PbrDemo from './pages/PbrDemo';
import BaseballCardViewer from './pages/BaseballCardViewer';
import SignatureDemo from './pages/SignatureDemo';
import ArCardViewer from './pages/ArCardViewer';
import CardComparison from './pages/CardComparison';
import CardAnimation from './pages/CardAnimation';

// Admin Page
import AdminPage from './pages/Admin';

// Custom wrapper for legacy route redirects
const LegacyRedirect = ({ from, to }: { from: string, to: string }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const redirectPath = currentPath.replace(from, to);
  return <Navigate to={redirectPath} replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <CardProvider>
            <Toaster richColors />
            <Routes>
              {/* Main landing page */}
              <Route path="/" element={<PageLayout showBreadcrumbs={false}><Index /></PageLayout>} />
              
              {/* Cards section */}
              <Route path="/cards">
                <Route index element={<Navigate to="/cards/gallery" replace />} />
                <Route path="gallery" element={<PageLayout><Gallery /></PageLayout>} />
                <Route path="create" element={<PageLayout><Editor /></PageLayout>} />
                <Route path="detect" element={<PageLayout><CardDetector /></PageLayout>} />
                <Route path=":id" element={<PageLayout><CardShowcase /></PageLayout>} />
              </Route>
              
              {/* Collections section */}
              <Route path="/collections">
                <Route index element={<PageLayout><Collections /></PageLayout>} />
                <Route path=":id" element={<PageLayout><CollectionDetail /></PageLayout>} />
                <Route path=":id/edit" element={<PageLayout><CollectionForm /></PageLayout>} />
                <Route path="new" element={<PageLayout><CollectionForm /></PageLayout>} />
              </Route>
              
              {/* Teams section */}
              <Route path="/teams">
                {/* Oakland A's team page */}
                <Route path="oakland">
                  <Route index element={<PageLayout><OaklandLanding /></PageLayout>} />
                  <Route path="memories" element={<PageLayout><OaklandMemories /></PageLayout>} />
                  <Route path="memories/:id" element={<PageLayout><OaklandMemoryDetail /></PageLayout>} />
                  <Route path="create" element={<PageLayout><OaklandMemoryCreator /></PageLayout>} />
                </Route>
              </Route>
              
              {/* Experiences section */}
              <Route path="/experiences">
                <Route path="gameday" element={<PageLayout showBreadcrumbs={false}><GameDayMode /></PageLayout>} />
              </Route>
              
              {/* Features Demo section */}
              <Route path="/features">
                <Route path="pbr" element={<PageLayout><PbrDemo /></PageLayout>} />
                <Route path="baseball-viewer" element={<PageLayout><BaseballCardViewer /></PageLayout>} />
                <Route path="signature" element={<PageLayout><SignatureDemo /></PageLayout>} />
                <Route path="ar-viewer" element={<PageLayout><ArCardViewer /></PageLayout>} />
                <Route path="card-comparison" element={<PageLayout><CardComparison /></PageLayout>} />
                <Route path="animation" element={<PageLayout><CardAnimation /></PageLayout>} />
              </Route>
              
              {/* Memory Pack section */}
              <Route path="/packs">
                <Route index element={<PageLayout><MemoryPacks /></PageLayout>} />
                <Route path=":id" element={<PageLayout><MemoryPackDetail /></PageLayout>} />
                <Route path="new" element={<PageLayout><MemoryPackCreator /></PageLayout>} />
                <Route path=":id/edit" element={<PageLayout><MemoryPackCreator /></PageLayout>} />
              </Route>
              
              {/* Admin section */}
              <Route path="/admin" element={<PageLayout><AdminPage /></PageLayout>} />
              
              {/* Authentication */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Legacy route redirects */}
              <Route path="/card/:id" element={<LegacyRedirect from="/card/" to="/cards/" />} />
              <Route path="/editor" element={<Navigate to="/cards/create" replace />} />
              <Route path="/card-detector" element={<Navigate to="/cards/detect" replace />} />
              <Route path="/oakland" element={<Navigate to="/teams/oakland" replace />} />
              <Route path="/oakland/memories" element={<Navigate to="/teams/oakland/memories" replace />} />
              <Route path="/oakland/memories/:id" element={<LegacyRedirect from="/oakland/memories/" to="/teams/oakland/memories/" />} />
              <Route path="/oakland/create" element={<Navigate to="/teams/oakland/create" replace />} />
              <Route path="/gameday" element={<Navigate to="/experiences/gameday" replace />} />
              <Route path="/pbr" element={<Navigate to="/features/pbr" replace />} />
              <Route path="/baseball-card-viewer" element={<Navigate to="/features/baseball-viewer" replace />} />
              <Route path="/signature" element={<Navigate to="/features/signature" replace />} />
              <Route path="/ar-card-viewer" element={<Navigate to="/features/ar-viewer" replace />} />
              <Route path="/card-comparison" element={<Navigate to="/features/card-comparison" replace />} />
              <Route path="/animation" element={<Navigate to="/features/animation" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
            </Routes>
          </CardProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
