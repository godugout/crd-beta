
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CardStateProvider } from './lib/state/providers/CardStateProvider';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CardDetail from './pages/CardDetail';
import CardViewerExperimental from './pages/CardViewerExperimental';
import ImmersiveCardViewerDemo from './pages/ImmersiveCardViewerDemo';
import { Toaster } from 'sonner';
import ImmersiveViewer from './pages/ImmersiveViewer';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cardshow-theme">
      <AuthProvider autoLogin={true}>
        <CardStateProvider>
          <Router>
            <Toaster />
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Card Routes */}
              <Route path="/cards" element={<Gallery />} />
              <Route path="/cards/:id" element={<CardDetail />} />
              <Route path="/cards/create" element={<CardDetail />} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth/*" element={<Auth />} />
              
              {/* Collections */}
              <Route path="/collections" element={<Gallery />} />
              <Route path="/collections/:id" element={<CardDetail />} />
              
              {/* Teams */}
              <Route path="/teams" element={<Gallery />} />
              <Route path="/teams/:id" element={<CardDetail />} />
              
              {/* Immersive Experience */}
              <Route path="/immersive/:id?" element={<ImmersiveViewer />} />
              
              {/* Labs/Experimental Routes */}
              <Route path="/labs/card-viewer/:id" element={<CardViewerExperimental />} />
              <Route path="/labs/immersive/:id?" element={<ImmersiveCardViewerDemo />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </CardStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
