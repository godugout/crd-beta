
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import UnifiedCardGalleryPage from '@/pages/UnifiedCardGalleryPage';
import CardDetector from '@/pages/CardDetector';
import ImmersiveCardViewerPage from '@/pages/ImmersiveCardViewerPage';

export const cardRoutes: RouteObject[] = [
  {
    path: "/cards",
    element: <UnifiedCardGalleryPage />,
  },
  {
    path: "/gallery", 
    element: <UnifiedCardGalleryPage />,
  },
  {
    path: "/cards/:id",
    element: <CardDetail />,
  },
  {
    path: "/cards/detector",
    element: <CardDetector />,
  },
  {
    path: "/immersive/:id",
    element: <ImmersiveCardViewerPage />,
  },
];
