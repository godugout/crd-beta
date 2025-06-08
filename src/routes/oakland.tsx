
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const OaklandMemoryCreator = lazy(() => import('@/components/oakland/OaklandMemoryCreator'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
  }
];
