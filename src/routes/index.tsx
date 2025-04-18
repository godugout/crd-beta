
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
import { Navigate } from 'react-router-dom';

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
const CardCreator = React.lazy(() => import('@/pages/CardCreator'));
const CardDetector = React.lazy(() => import('@/pages/CardDetector')); 
const TeamPage = React.lazy(() => import('@/pages/TeamPage')); 
const ArCardViewerPage = React.lazy(() => import('@/pages/ArCardViewerPage'));

// Main application routes
const rootRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/gallery",
    element: <CardGallery />
  },
  {
    path: "/cards/create",
    element: <React.Suspense fallback={<div>Loading...</div>}><CardCreator /></React.Suspense>
  },
  {
    path: "/collections",
    element: <Collections />
  },
  {
    path: "/packs",
    element: <CollectionGallery />
  },
  {
    path: "/labs",
    element: <DeckViewPage />
  },
  {
    path: "/features/game-day",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/teams",
    element: <TownCommunityHub />
  },
  {
    path: "/teams/:teamId",
    element: <React.Suspense fallback={<div>Loading...</div>}><TeamPage /></React.Suspense>
  },
  {
    path: "/community",
    element: <TownCommunityHub />
  },
  {
    path: "/detector",
    element: (
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading Card Detector...</p>
          </div>
        </div>
      }>
        <CardDetector />
      </React.Suspense>
    )
  },
  {
    path: "/cards",
    element: <CardCollectionPage />
  },
  {
    path: "/cards/:id",
    element: <CardDetail />
  },
  {
    path: "/basketball-cards",
    element: <Navigate to="/cards" replace />
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
    path: "/ar-card-viewer/:id",
    element: <React.Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading AR Experience...</p>
        </div>
      </div>
    }>
      <ArCardViewerPage />
    </React.Suspense>
  },
  {
    path: "/ar-card-viewer",
    element: <React.Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading AR Experience...</p>
        </div>
      </div>
    }>
      <ArCardViewerPage />
    </React.Suspense>
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export const routes: RouteObject[] = [
  ...rootRoutes,
  ...mainRoutes.filter(route => route.path !== "/" && route.path !== "*" && route.path !== "/community"),
  ...teamRoutes,
  ...townRoutes,
  ...baseballRoutes,
  ...featureRoutes,
  ...cardRoutes.filter(route => route.path !== "/cards" && route.path !== "/cards/:id"),
  ...collectionRoutes.filter(route => route.path !== "/collections"),
  
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
