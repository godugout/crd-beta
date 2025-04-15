
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';

// Import the team-related routes
import TeamDetail from '@/pages/TeamDetail';
import { teamRoutes } from './teamRoutes';  // Import the team routes

// Import admin page
import Admin from '@/pages/Admin';

// Import other route collections
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { mainRoutes } from './mainRoutes';  // Import the main routes
import { baseballRoutes } from './baseballRoutes';  // Import the baseball routes
import featureRoutes from './featureRoutes';  // Import the feature routes
import { labsRoutes } from './labsRoutes';  // Import the labs routes

// Create new pages for deck and series management
const DeckBuilderPage = React.lazy(() => import('@/pages/DeckBuilderPage'));
const SeriesManagerPage = React.lazy(() => import('@/pages/SeriesManagerPage'));
const DeckViewPage = React.lazy(() => import('@/pages/DeckViewPage'));
const SeriesViewPage = React.lazy(() => import('@/pages/SeriesViewPage'));

export const routes: RouteObject[] = [
  ...mainRoutes, // Include main routes
  ...teamRoutes, // Include team routes
  ...baseballRoutes, // Include baseball routes
  ...featureRoutes, // Include feature routes
  ...labsRoutes, // Include labs routes
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
