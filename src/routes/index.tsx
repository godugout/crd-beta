
import React, { Suspense } from 'react';
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
const Labs = React.lazy(() => import('@/pages/Labs'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CardCreator />
      </Suspense>
    )
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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Labs />
      </Suspense>
    )
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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TeamPage />
      </Suspense>
    )
  },
  {
    path: "/community",
    element: <TownCommunityHub />
  },
  {
    path: "/detector",
    element: (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading Card Detector...</p>
          </div>
        </div>
      }>
        <CardDetector />
      </Suspense>
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
    path: "/immersive/:id",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/immersive",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/ar-card-viewer/:id",
    element: (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading AR Experience...</p>
          </div>
        </div>
      }>
        <ArCardViewerPage />
      </Suspense>
    )
  },
  {
    path: "/ar-card-viewer",
    element: (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading AR Experience...</p>
          </div>
        </div>
      }>
        <ArCardViewerPage />
      </Suspense>
    )
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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DeckViewPage />
      </Suspense>
    )
  },
  {
    path: "/decks/create",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DeckBuilderPage />
      </Suspense>
    )
  },
  {
    path: "/decks/:deckId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DeckViewPage />
      </Suspense>
    )
  },
  {
    path: "/decks/:deckId/edit",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DeckBuilderPage />
      </Suspense>
    )
  },
  
  // Series routes
  {
    path: "/series",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SeriesViewPage />
      </Suspense>
    )
  },
  {
    path: "/series/create",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SeriesManagerPage />
      </Suspense>
    )
  },
  {
    path: "/series/:seriesId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SeriesViewPage />
      </Suspense>
    )
  },
  {
    path: "/series/:seriesId/edit",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SeriesManagerPage />
      </Suspense>
    )
  },
];
