import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import MediaLibrary from '@/pages/MediaLibrary';
import CardGallery from '@/pages/CardGallery';
import BatchOperationsPage from '@/pages/BatchOperationsPage';
import CardEditor from './components/CardEditor';
import BaseballCardViewer from './pages/BaseballCardViewer';
import OaklandMemoriesPage from './pages/OaklandMemoriesPage';
import OaklandMemoryDetailsPage from './pages/OaklandMemoryDetailsPage';
import GameDayCapturePage from './pages/GameDayCapturePage';
import GroupMemoryPage from './pages/GroupMemoryPage';
import { CardContextProvider } from './context/CardContext';
import { AuthContextProvider } from './context/auth';
import { MobileOptimizationProvider } from './hooks/useMobileOptimization';
import { ConnectivityProvider } from './hooks/useConnectivity';
import ExperimentalPage from './pages/ExperimentalPage';

function App() {
  return (
    <BrowserRouter>
      <ConnectivityProvider>
        <MobileOptimizationProvider>
          <AuthContextProvider>
            <CardContextProvider>
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
            </CardContextProvider>
          </AuthContextProvider>
        </MobileOptimizationProvider>
      </ConnectivityProvider>
    </BrowserRouter>
  );
}

export default App;
