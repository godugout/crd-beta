
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardGallery from '@/pages/CardGallery';
import CardDetail from '@/pages/CardDetail';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CardCreator from '@/pages/CardCreator';
import Editor from '@/pages/Editor';
import ImmersiveCardViewer from '@/pages/ImmersiveCardViewer';

// Card-related routes
export const cardRoutes: RouteObject[] = [
  {
    path: "/cards",
    element: <CardGallery />,
  },
  {
    path: "/gallery",
    element: <CardGallery />,
  },
  {
    path: "/card/:id",
    element: <CardDetail />,
  },
  {
    path: "/cards/create",
    element: <ProtectedRoute><CardCreator /></ProtectedRoute>,
  },
  {
    path: "/create",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/edit/:id",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/view/:id",
    element: <ImmersiveCardViewer />,
  }
];

export default cardRoutes;
