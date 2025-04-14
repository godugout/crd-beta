
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardGallery from '@/pages/CardGallery';
import CardDetail from '@/pages/CardDetail';
import CardDetector from '@/pages/CardDetector';
import Editor from '@/pages/Editor';
import CardCreatorPage from '@/pages/CardCreatorPage';
import CardShowcase from '@/pages/CardShowcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CardCreationFlow from '@/components/card-editor/CardCreationFlow';

// Card-related routes
export const cardRoutes: RouteObject[] = [
  {
    path: "/cards",
    element: <CardGallery />,
  },
  {
    path: "/cards/effects",
    element: <CardGallery />, // Should be implemented as a dedicated page
  },
  {
    path: "/cards/create",
    element: <ProtectedRoute><CardCreatorPage /></ProtectedRoute>,
  },
  {
    path: "/card/:id",
    element: <CardDetail />,
  },
  {
    path: "/card/create",
    element: <ProtectedRoute><CardCreatorPage /></ProtectedRoute>,
  },
  {
    path: "/detector",
    element: <CardDetector />,
  },
  {
    path: "/animation",
    element: <CardShowcase />, // Should be implemented as a dedicated page
  },
  {
    path: "/editor",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/editor/:id",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/card-upload",
    element: <ProtectedRoute><CardCreationFlow /></ProtectedRoute>,
  },
  {
    path: "/card-creator",
    element: <CardCreatorPage />,
  },
  {
    path: "/card-creator/:step",
    element: <CardCreatorPage />,
  },
];

export default cardRoutes;
