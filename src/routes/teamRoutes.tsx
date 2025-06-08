
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load team components for better performance
const UniversalTeamPage = lazy(() => import('@/pages/teams/UniversalTeamPage'));
const TeamMemoriesGallery = lazy(() => import('@/components/teams/TeamMemoriesGallery'));
const TeamMemoryCreator = lazy(() => import('@/components/teams/TeamMemoryCreator'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
  </div>
);

// Team-related routes
export const teamRoutes: RouteObject[] = [
  {
    path: "/teams/:teamSlug",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <UniversalTeamPage />
      </Suspense>
    )
  },
  {
    path: "/teams/:teamSlug/memories",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <TeamMemoriesGallery />
      </Suspense>
    )
  },
  {
    path: "/teams/:teamSlug/create",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <TeamMemoryCreator />
      </Suspense>
    )
  }
];
