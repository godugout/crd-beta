
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { mainRoutes } from './mainRoutes';
import { cardRoutes } from './cardRoutes';
import { collectionRoutes } from './collectionRoutes';
import { teamRoutes } from './teamRoutes';
import { featureRoutes } from './featureRoutes';
import baseballRoutes from './baseballRoutes';

const router = createBrowserRouter([
  ...mainRoutes,
  ...cardRoutes,
  ...collectionRoutes,
  ...teamRoutes,
  ...featureRoutes,
  ...baseballRoutes
]);

export default router;
