
import React from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import CardViewerPage from '@/pages/CardViewerPage';
import ImmersiveCardViewerPage from '@/pages/ImmersiveCardViewerPage';
import CardCollectionPage from '@/pages/CardCollectionPage';
import CollectionGallery from '@/pages/CollectionGallery';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
import Unauthorized from '@/pages/Unauthorized';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import Collections from '@/pages/Collections';
import TownCommunityHub from '@/pages/TownCommunityHub';
import CardShowcase from '@/pages/CardShowcase'; // Import the CardShowcase page for basketball players

// Import other route collections
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { mainRoutes } from './mainRoutes';
import { baseballRoutes } from './baseballRoutes';
import featureRoutes from './featureRoutes';
import { teamRoutes } from './teamRoutes';
import { townRoutes } from './townRoutes';

// Create new pages for deck and series management
const DeckBuilderPage = React.lazy(() => import('@/pages/DeckBuilderPage'));
const SeriesManagerPage = React.lazy(() => import('@/pages/SeriesManagerPage'));
const DeckViewPage = React.lazy(() => import('@/pages/DeckViewPage'));
const SeriesViewPage = React.lazy(() => import('@/pages/SeriesViewPage'));

// Main application routes
const rootRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/cards",
    element: <CardCollectionPage />
  },
  {
    path: "/cards/:id",
    element: <CardViewerPage />
  },
  {
    path: "/basketball-cards", // New route specifically for basketball player cards
    element: <CardShowcase />
  },
  {
    path: "/immersive/:id",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/immersive",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/collections",
    element: <Collections />
  },
  {
    path: "/community",
    element: <TownCommunityHub />
  },
  {
    path: "/teams",
    element: <TownCommunityHub />
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export const routes: RouteObject[] = [
  ...rootRoutes,
  ...mainRoutes.filter(route => route.path !== "/" && route.path !== "*" && route.path !== "/community"), // Avoid duplicates
  ...teamRoutes,
  ...townRoutes,
  ...baseballRoutes,
  ...featureRoutes,
  ...cardRoutes.filter(route => route.path !== "/cards" && route.path !== "/cards/:id"), // Avoid duplicates
  ...collectionRoutes.filter(route => route.path !== "/collections"), // Avoid duplicates
  
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
];
