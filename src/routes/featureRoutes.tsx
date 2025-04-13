
import React from 'react';
import { RouteObject } from 'react-router-dom';
import DeveloperDocs from '@/pages/DeveloperDocs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CacheExample from '@/components/examples/CacheExample';
import CardShowcase from '@/pages/CardShowcase';
import Experiences from '@/pages/Experiences';
import Labs from '@/pages/Labs';
import PbrDemo from '@/pages/PbrDemo';
import SignatureDemo from '@/pages/SignatureDemo';
import CardAnimation from '@/pages/CardAnimation';

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
            <Experiences />
          </ProtectedRoute>
        )
      },
      {
        path: 'labs',
        element: (
          <ProtectedRoute>
            <Labs />
          </ProtectedRoute>
        )
      },
      {
        path: 'pbr',
        element: (
          <ProtectedRoute>
            <PbrDemo />
          </ProtectedRoute>
        )
      },
      {
        path: 'signature',
        element: (
          <ProtectedRoute>
            <SignatureDemo />
          </ProtectedRoute>
        )
      },
      {
        path: 'cache-example',
        element: <CacheExample />
      },
      {
        path: 'animation',
        element: <CardAnimation />
      },
      {
        path: 'developer',
        element: <DeveloperDocs />
      }
    ]
  }
];

export default featureRoutes;
