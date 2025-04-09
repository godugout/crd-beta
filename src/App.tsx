
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import MediaLibrary from './pages/MediaLibrary';
import CardGallery from './pages/CardGallery';
import BatchOperationsPage from './pages/BatchOperationsPage';
import CardEditor from './components/CardEditor';
import BaseballCardViewer from './pages/BaseballCardViewer';
import OaklandMemoriesPage from './pages/oakland/OaklandMemories';
import OaklandMemoryDetailsPage from './pages/oakland/OaklandMemoryDetail';
import GameDayCapturePage from './pages/GameDayMode';
import GroupMemoryPage from './pages/GroupMemoryCreator';
import CollectionGallery from './pages/CollectionGallery';
import MemoryPacks from './pages/MemoryPacks';
import MemoryPackCreator from './pages/MemoryPackCreator';
import MemoryPackDetail from './pages/MemoryPackDetail';
import { CardProvider } from './context/CardContext';
import { AuthProvider } from './context/auth/AuthProvider';
import { useMobileOptimization } from './hooks/useMobileOptimization';
import { useConnectivity } from './hooks/useConnectivity';
import ExperimentalPage from './pages/Labs';
import { queryClient } from './lib/api/queryClient';
import { DamProvider } from './providers/DamProvider';
import TeamsGallery from './pages/TeamGallery';

// Create Provider components from hooks
const MobileOptimizationProvider = ({ children }) => {
  useMobileOptimization();
  return <>{children}</>;
};

// Create ConnectivityProvider
const ConnectivityProvider = ({ children }) => {
  useConnectivity();
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConnectivityProvider>
          <MobileOptimizationProvider>
            <AuthProvider>
              <CardProvider>
                <DamProvider>
                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* Cards Routes */}
                    <Route path="/cards" element={<CardGallery />} />
                    <Route path="/cards/create" element={<CardEditor />} />
                    <Route path="/cards/:id/edit" element={<CardEditor />} />
                    <Route path="/cards/batch" element={<BatchOperationsPage />} />
                    
                    {/* Collections Routes */}
                    <Route path="/collections" element={<CollectionGallery />} />
                    <Route path="/collections/create" element={<MemoryPackCreator />} />
                    
                    {/* Memory Packs Routes */}
                    <Route path="/packs" element={<MemoryPacks />} />
                    <Route path="/packs/create" element={<MemoryPackCreator />} />
                    <Route path="/packs/:id" element={<MemoryPackDetail />} />
                    
                    {/* Legacy Memory Packs Routes (for backward compatibility) */}
                    <Route path="/memory-packs" element={<MemoryPacks />} />
                    <Route path="/memory-packs/:id" element={<MemoryPackDetail />} />
                    <Route path="/create-memory-pack" element={<MemoryPackCreator />} />
                    
                    {/* Teams Routes */}
                    <Route path="/teams" element={<TeamsGallery />} />
                    <Route path="/teams/oakland" element={<OaklandMemoriesPage />} />
                    <Route path="/teams/oakland/memories" element={<OaklandMemoriesPage />} />
                    <Route path="/teams/oakland/memories/:id" element={<OaklandMemoryDetailsPage />} />
                    
                    {/* Features Routes */}
                    <Route path="/features/baseball-viewer/:id" element={<BaseballCardViewer />} />
                    <Route path="/baseball-card-viewer/:id" element={<BaseballCardViewer />} />
                    <Route path="/game-day" element={<GameDayCapturePage />} />
                    <Route path="/group-memory" element={<GroupMemoryPage />} />
                    
                    {/* Media Library */}
                    <Route path="/media-library" element={<MediaLibrary />} />
                    
                    {/* Experimental */}
                    <Route path="/experimental" element={<ExperimentalPage />} />
                    
                    {/* 404 - Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </DamProvider>
              </CardProvider>
            </AuthProvider>
          </MobileOptimizationProvider>
        </ConnectivityProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
