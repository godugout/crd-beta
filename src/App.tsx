
import { Routes, Route, useRoutes } from 'react-router-dom';
import { CardProvider } from './context/CardContext';
import { SessionProvider } from './context/SessionContext';
import { Toaster } from 'sonner';
import { routes } from './routes';

function App() {
  const routeElements = useRoutes(routes);

  return (
    <SessionProvider>
      <CardProvider>
        {routeElements}
        <Toaster 
          position="bottom-right"
          closeButton
        />
      </CardProvider>
    </SessionProvider>
  );
}

export default App;
