
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster'; // Updated to use shadcn's Toaster
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import CardCollectionPage from './pages/CardCollectionPage';
import ImmersiveCardViewer from './pages/ImmersiveCardViewer';
import BaseballCardViewer from './pages/BaseballCardViewer';
import BaseballActionFigure from './pages/BaseballActionFigure';
import { CardProvider } from './context/CardContext';
import { SettingsProvider } from './context/SettingsContext';

// Import route configurations
import { routes } from './routes/index';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cardshow-dark to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <CardProvider>
        <Router>
          <Routes>
            {/* Import all routes from the routes configuration */}
            {routes.map((route, index) => {
              // Handle nested routes
              if (route.children) {
                return (
                  <Route key={`parent-${index}`} path={route.path} element={route.element}>
                    {route.children.map((childRoute, childIndex) => (
                      <Route 
                        key={`child-${childIndex}`}
                        path={childRoute.path}
                        element={childRoute.element}
                      />
                    ))}
                  </Route>
                );
              }
              
              // Handle standard routes
              return (
                <Route 
                  key={`route-${index}`} 
                  path={route.path} 
                  element={route.element} 
                />
              );
            })}

            {/* Legacy routes for backward compatibility */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cards" element={<CardCollectionPage />} />
            <Route path="/view/:id" element={<ImmersiveCardViewer />} />
            <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
            <Route path="/baseball-action-figure" element={<BaseballActionFigure />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </CardProvider>
    </SettingsProvider>
  );
}

export default App;
