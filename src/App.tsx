
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
                    <Route path="/" element={<HomePage />} />
                    <Route path="/media-library" element={<MediaLibrary />} />
                    <Route path="/batch-operations" element={<BatchOperationsPage />} />
                    <Route path="/cards" element={<CardGallery />} />
                    <Route path="/cards/create" element={<CardEditor />} />
                    <Route path="/cards/:id/edit" element={<CardEditor />} />
                    <Route path="/baseball-card-viewer/:id" element={<BaseballCardViewer />} />
                    <Route path="/teams/oakland/memories" element={<OaklandMemoriesPage />} />
                    <Route path="/teams/oakland/memories/:id" element={<OaklandMemoryDetailsPage />} />
                    <Route path="/game-day" element={<GameDayCapturePage />} />
                    <Route path="/group-memory" element={<GroupMemoryPage />} />
                    <Route path="/collections" element={<CollectionGallery />} />
                    <Route path="/collections/new" element={<MemoryPackCreator />} />
                    <Route path="/memory-packs" element={<MemoryPacks />} />
                    <Route path="/packs" element={<MemoryPacks />} /> {/* Alias for memory-packs */}
                    <Route path="/memory-packs/:id" element={<MemoryPackDetail />} />
                    <Route path="/packs/:id" element={<MemoryPackDetail />} /> {/* Alias for memory-packs/:id */}
                    <Route path="/create-memory-pack" element={<MemoryPackCreator />} /> {/* Additional route */}
                    <Route path="/experimental" element={<ExperimentalPage />} />
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
