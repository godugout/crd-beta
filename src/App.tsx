
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { CardContext } from './context/CardContext';
import { AuthProvider } from './context/auth/AuthProvider';
import { useMobileOptimization } from './hooks/useMobileOptimization';
import { useConnectivity } from './hooks/useConnectivity';
import ExperimentalPage from './pages/Labs';

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
      <ConnectivityProvider>
        <MobileOptimizationProvider>
          <AuthProvider>
            <CardContext>
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
                <Route path="/experimental" element={<ExperimentalPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </CardContext>
          </AuthProvider>
        </MobileOptimizationProvider>
      </ConnectivityProvider>
    </BrowserRouter>
  );
}

export default App;
