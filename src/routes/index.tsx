
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';

// Import the town-related routes
import TeamDetail from '@/pages/TeamDetail';
import TownDetail from '@/pages/TownDetail';
import { teamRoutes } from './teamRoutes';  // Keep for backward compatibility
import { townRoutes } from './townRoutes';  // Add new town routes

// Import admin page
import Admin from '@/pages/Admin';

// Import other route collections
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { mainRoutes } from './mainRoutes';
import { baseballRoutes } from './baseballRoutes';
import featureRoutes from './featureRoutes';

// Create new pages for deck and series management
const DeckBuilderPage = React.lazy(() => import('@/pages/DeckBuilderPage'));
const SeriesManagerPage = React.lazy(() => import('@/pages/SeriesManagerPage'));
const DeckViewPage = React.lazy(() => import('@/pages/DeckViewPage'));
const SeriesViewPage = React.lazy(() => import('@/pages/SeriesViewPage'));

export const routes: RouteObject[] = [
  ...mainRoutes,
  ...teamRoutes, // Keep for backward compatibility
  ...townRoutes, // Add new town routes
  ...baseballRoutes,
  ...featureRoutes,
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/teams/:teamId",
    element: <TeamDetail />,
  },
  {
    path: "/towns/:townId",
    element: <TownDetail />,
  },
  
  // Deck routes
  {
    path: "/decks",
    element: <React.Suspense fallback={<div>Loading...</div>}><DeckViewPage /></React.Suspense>,
  },
  {
    path: "/decks/create",
    element: <React.Suspense fallback={<div>Loading...</div>}><DeckBuilderPage /></React.Suspense>,
  },
  {
    path: "/decks/:deckId",
    element: <React.Suspense fallback={<div>Loading...</div>}><DeckViewPage /></React.Suspense>,
  },
  {
    path: "/decks/:deckId/edit",
    element: <React.Suspense fallback={<div>Loading...</div>}><DeckBuilderPage /></React.Suspense>,
  },
  
  // Series routes
  {
    path: "/series",
    element: <React.Suspense fallback={<div>Loading...</div>}><SeriesViewPage /></React.Suspense>,
  },
  {
    path: "/series/create",
    element: <React.Suspense fallback={<div>Loading...</div>}><SeriesManagerPage /></React.Suspense>,
  },
  {
    path: "/series/:seriesId",
    element: <React.Suspense fallback={<div>Loading...</div>}><SeriesViewPage /></React.Suspense>,
  },
  {
    path: "/series/:seriesId/edit",
    element: <React.Suspense fallback={<div>Loading...</div>}><SeriesManagerPage /></React.Suspense>,
  },
  
  // Include card routes and collection routes
  ...cardRoutes,
  ...collectionRoutes,
];
