
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardCollectionPage from '@/pages/CardCollectionPage';
import CardCreator from '@/pages/CardCreator';
import CardDetector from '@/pages/CardDetector';
import ImmersiveCardViewerPage from '@/pages/ImmersiveCardViewerPage';

export const cardRoutes: RouteObject[] = [
  {
    path: '/cards',
    element: <CardCollectionPage />
  },
  {
    path: '/cards/create',
    element: <CardCreator />
  },
  {
    path: '/cards/:id',
    element: <CardDetail />
  },
  {
    path: '/cards/detector',
    element: <CardDetector />
  },
  {
    path: '/immersive/:id',
    element: <ImmersiveCardViewerPage />
  }
];

