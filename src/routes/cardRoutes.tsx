
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import CardDetector from '@/pages/CardDetector';
import UnifiedCardEditor from '@/pages/UnifiedCardEditor';
import ImmersiveCardViewerPage from '@/pages/ImmersiveCardViewerPage';
import CardCollectionPage from '@/pages/CardCollectionPage';

export const cardRoutes: RouteObject[] = [
  {
    path: "/cards",
    element: <CardCollectionPage />,
  },
  {
    path: "/cards/:id",
    element: <CardDetail />,
  },
  {
    path: "/cards/create",
    element: <UnifiedCardEditor />,
  },
  {
    path: "/cards/edit/:id",
    element: <UnifiedCardEditor />,
  },
  {
    path: "/create",
    element: <UnifiedCardEditor />,
  },
  {
    path: "/edit/:id", 
    element: <UnifiedCardEditor />,
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
