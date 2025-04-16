
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import CardCollectionPage from './pages/CardCollectionPage';
import BaseballCardViewer from './pages/BaseballCardViewer';
import BaseballActionFigure from './pages/BaseballActionFigure';
import { CardProvider } from './context/CardContext';
import { SettingsProvider } from './context/SettingsContext';
import EmergencyPage from './pages/EmergencyPage';
import { useAuth } from './hooks/useAuth';
import { BreadcrumbProvider } from './hooks/breadcrumbs/BreadcrumbContext';

import { routes } from './routes/index';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    
    console.log('App is initializing', { routes, authStatus: isAuthenticated ? 'authenticated' : 'not authenticated' });

    try {
      const requiredDeps = [
        { name: 'React Router', check: () => !!Router },
        { name: 'Routes Component', check: () => !!Routes },
        { name: 'CardProvider', check: () => !!CardProvider },
      ];
      
      const missingDeps = requiredDeps.filter(dep => !dep.check());
      if (missingDeps.length > 0) {
        throw new Error(`Missing dependencies: ${missingDeps.map(d => d.name).join(', ')}`);
      }
    } catch (err: any) {
      console.error('Dependency check failed:', err);
      setError(err.message || 'Failed to initialize app dependencies');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

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

  console.log('Rendering App with routes:', routes);

  return (
    <SettingsProvider>
      <Router>
        <BreadcrumbProvider>
          <div className="debug-info fixed top-0 left-0 bg-black/80 text-white p-2 text-xs z-50">
            App Loaded | {new Date().toLocaleTimeString()} | {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/emergency" element={<EmergencyPage />} />

            {routes.map((route, index) => {
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
              
              return (
                <Route 
                  key={`route-${index}`} 
                  path={route.path} 
                  element={route.element} 
                />
              );
            })}

            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cards" element={<CardCollectionPage />} />
            <Route path="/baseball-card-viewer" element={<BaseballCardViewer />} />
            <Route path="/baseball-action-figure" element={<BaseballActionFigure />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BreadcrumbProvider>
      </Router>
    </SettingsProvider>
  );
}

export default App;
