
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Collections from '@/pages/Collections';
import NotFound from '@/pages/NotFound';
import { mainRoutes } from './mainRoutes';
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { communityRoutes } from './communityRoutes';
import { featureRoutes } from './featureRoutes';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Root-level routes
const rootRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "*",
    element: <NotFound />
  }
];

// Combine all routes - order matters for route matching
export const routes: RouteObject[] = [
  ...rootRoutes,
  ...mainRoutes,
  ...cardRoutes,
  ...collectionRoutes,
  ...communityRoutes,
  ...featureRoutes
];

