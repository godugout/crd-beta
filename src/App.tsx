
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { CardProvider } from './context/CardContext';
import { SessionProvider } from './context/SessionContext';
import { Toaster } from 'sonner';
import { routes } from './routes';

// Loading fallback for the entire app
const AppLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-t-primary border-primary/30 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-foreground">Loading CardShow...</p>
    </div>
  </div>
);

function App() {
  const routeElements = useRoutes(routes);

  return (
    <SessionProvider>
      <CardProvider>
        <Suspense fallback={<AppLoadingFallback />}>
          {routeElements}
        </Suspense>
        <Toaster 
          position="bottom-right"
          closeButton
        />
      </CardProvider>
    </SessionProvider>
  );
}

export default App;
