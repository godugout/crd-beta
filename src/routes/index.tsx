
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
import UnifiedCardEditor from '@/pages/UnifiedCardEditor';

// Import other route collections
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { mainRoutes } from './mainRoutes';
import { baseballRoutes } from './baseballRoutes';
import featureRoutes from './featureRoutes';
import { teamRoutes } from './teamRoutes';
import { townRoutes } from './townRoutes';

// Lazy load pages that might suspend
const DeckBuilderPage = React.lazy(() => import('@/pages/DeckBuilderPage'));
const SeriesManagerPage = React.lazy(() => import('@/pages/SeriesManagerPage'));
const DeckViewPage = React.lazy(() => import('@/pages/DeckViewPage'));
const SeriesViewPage = React.lazy(() => import('@/pages/SeriesViewPage'));
const CardDetector = React.lazy(() => import('@/pages/CardDetector'));
const TeamPage = React.lazy(() => import('@/pages/TeamPage'));
const ArCardViewerPage = React.lazy(() => import('@/pages/ArCardViewerPage'));
const Labs = React.lazy(() => import('@/pages/Labs'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Unified card editor routes
const cardEditorRoutes: RouteObject[] = [
  {
    path: "/cards/create",
    element: <UnifiedCardEditor />
  },
  {
    path: "/cards/edit/:id",
    element: <UnifiedCardEditor />
  },
  {
    path: "/create",
    element: <UnifiedCardEditor />
  },
  {
    path: "/editor",
    element: <UnifiedCardEditor />
  },
  {
    path: "/editor/:id",
    element: <UnifiedCardEditor />
  },
  {
    path: "/edit/:id",
    element: <UnifiedCardEditor />
  }
];

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
    path: "/cards",
    element: <CardCollectionPage />
  },
  {
    path: "/cards/:id",
    element: <CardDetail />
  },
  {
    path: "/collections",
    element: <Collections />
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
    path: "/viewer/:id",
    element: <CardViewerPage />
  },
  {
    path: "/immersive/:id",
    element: <ImmersiveCardViewerPage />
  },
  {
    path: "/ar-viewer/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ArCardViewerPage />
      </Suspense>
    )
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export const routes: RouteObject[] = [
  ...rootRoutes,
  ...cardEditorRoutes,
  ...mainRoutes.filter(route => !cardEditorRoutes.some(cr => cr.path === route.path)),
  ...teamRoutes,
  ...townRoutes,
  ...baseballRoutes,
  ...featureRoutes,
  ...cardRoutes.filter(route => !cardEditorRoutes.some(cr => cr.path === route.path)),
  ...collectionRoutes.filter(route => route.path !== "/collections"),
];
