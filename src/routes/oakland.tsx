
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const OaklandMemoryCreator = lazy(() => import('@/components/oakland/OaklandMemoryCreator'));
const OaklandDesignSystem = lazy(() => import('@/components/oakland/OaklandDesignSystem'));
const OaklandTemplateLibrary = lazy(() => import('@/components/oakland/OaklandTemplateLibrary'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
  </div>
);

// Oakland-specific routes
export const oaklandRoutes: RouteObject[] = [
  {
    path: "/oakland/create",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <OaklandMemoryCreator />
      </Suspense>
    )
  },
  {
    path: "/oakland/gallery", 
    element: <div className="container mx-auto px-4 py-8"><div className="text-center text-gray-600">Oakland Community Gallery - Coming Soon</div></div>
  },
  {
    path: "/oakland/design-system",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <OaklandDesignSystem />
      </Suspense>
    )
  },
  {
    path: "/oakland/templates",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <OaklandTemplateLibrary />
      </Suspense>
    )
  }
];
