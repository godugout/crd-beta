
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load team components
const UniversalTeamPage = lazy(() => import('@/pages/teams/UniversalTeamPage'));
const TeamMemoryCreator = lazy(() => import('@/components/teams/TeamMemoryCreator'));
const TeamTemplateLibrary = lazy(() => import('@/components/teams/TeamTemplateLibrary'));
const TeamMemoriesGallery = lazy(() => import('@/components/teams/TeamMemoriesGallery'));
const CityPage = lazy(() => import('@/pages/cities/CityPage'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// New team-centric routes
export const teamRoutes: RouteObject[] = [
  // City-level routes
  {
    path: "/cities/:citySlug",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <CityPage />
      </Suspense>
    )
  },
  
  // Team-level routes
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
  },
  {
    path: "/teams/:teamSlug/templates",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <TeamTemplateLibrary />
      </Suspense>
    )
  },
  
  // Legacy redirects for Oakland (backward compatibility)
  {
    path: "/oakland",
    element: <div>Redirecting...</div>,
    loader: () => {
      window.location.href = '/teams/oakland-athletics';
      return null;
    }
  },
  {
    path: "/oakland/*",
    element: <div>Redirecting...</div>,
    loader: () => {
      const path = window.location.pathname.replace('/oakland', '/teams/oakland-athletics');
      window.location.href = path;
      return null;
    }
  }
];
