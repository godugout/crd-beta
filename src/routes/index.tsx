
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import { BreadcrumbProvider } from '@/hooks/breadcrumbs/BreadcrumbContext';
import { mainRoutes } from './mainRoutes';
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { teamRoutes } from './teamRoutes';
import { featureRoutes } from './featureRoutes';

// Combine all route groups
const allRoutes = [
  ...mainRoutes,
  ...cardRoutes,
  ...collectionRoutes,
  ...teamRoutes,
  ...featureRoutes,
];

// Apply global wrappers to all routes
const router = createBrowserRouter(
  allRoutes.map(route => ({
    ...route,
    element: (
      <BreadcrumbProvider>
        <GlobalErrorBoundary>{route.element}</GlobalErrorBoundary>
      </BreadcrumbProvider>
    )
  }))
);

export default router;
