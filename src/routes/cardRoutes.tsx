
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardDetail from '@/pages/CardDetail';
import CardGallery from '@/pages/CardGallery';
import CardEditorDemo from '@/pages/CardEditorDemo';
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
    path: "/cards/editor-demo",
    element: <CardEditorDemo />,
  },
  {
    path: "/cards/detector",
    element: <CardDetector />,
  },
];
