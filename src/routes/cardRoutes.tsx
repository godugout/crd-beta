
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import CardDetector from '@/pages/CardDetector';
import CardCreator from '@/pages/CardCreator';

export const cardRoutes: RouteObject[] = [
  {
    path: "/cards",
    element: <CardGallery />,
  },
  {
    path: "/cards/:id",
    element: <CardDetail />,
  },
  {
    path: "/cards/create",
    element: <CardCreator />,
  },
  {
    path: "/cards/detector",
    element: <CardDetector />,
  },
];
