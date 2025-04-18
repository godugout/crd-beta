
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CacheExample from '@/components/examples/CacheExample';
import CardShowcase from '@/pages/CardShowcase';

// Lazy load components that might suspend
const DeveloperDocs = React.lazy(() => import('@/pages/DeveloperDocs'));
const Experiences = React.lazy(() => import('@/pages/Experiences'));
const Labs = React.lazy(() => import('@/pages/Labs'));
const PbrDemo = React.lazy(() => import('@/pages/PbrDemo'));
const SignatureDemo = React.lazy(() => import('@/pages/SignatureDemo'));
const CardAnimation = React.lazy(() => import('@/pages/CardAnimation'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

const featureRoutes: RouteObject[] = [
  {
    path: 'features',
    children: [
      {
        path: 'card-showcase',
        element: <CardShowcase />
      },
      {
        path: 'experiences',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Experiences />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'labs',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Labs />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'pbr',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <PbrDemo />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'signature',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <SignatureDemo />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'cache-example',
        element: <CacheExample />
      },
      {
        path: 'animation',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CardAnimation />
          </Suspense>
        )
      },
      {
        path: 'developer',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DeveloperDocs />
          </Suspense>
        )
      }
    ]
  }
];

export default featureRoutes;
