
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Labs from '@/pages/Labs';
import CardDetector from '@/pages/CardDetector';
import PbrDemo from '@/pages/PbrDemo';
import SignatureDemo from '@/pages/SignatureDemo';
import CardAnimation from '@/pages/CardAnimation';
import CardCreator from '@/pages/CardCreator';
import UniformTextureDemo from '@/pages/UniformTextureDemo';
import CardCreatorPage from '@/pages/CardCreatorPage';
import CardShowcase from '@/pages/CardShowcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const labsRoutes: RouteObject[] = [
  {
    path: 'labs',
    element: <Labs />,
  },
  {
    path: 'labs/detector',
    element: <CardDetector />,
  },
  {
    path: 'labs/pbr',
    element: (
      <ProtectedRoute>
        <PbrDemo />
      </ProtectedRoute>
    )
  },
  {
    path: 'labs/signature',
    element: (
      <ProtectedRoute>
        <SignatureDemo />
      </ProtectedRoute>
    )
  },
  {
    path: 'labs/animation',
    element: <CardAnimation />,
  },
  {
    path: 'labs/uniforms',
    element: <UniformTextureDemo />,
  },
  {
    path: 'labs/card-creator',
    element: (
      <ProtectedRoute>
        <CardCreatorPage />
      </ProtectedRoute>
    )
  },
  {
    path: 'labs/showcase',
    element: <CardShowcase />,
  }
];

export default labsRoutes;
