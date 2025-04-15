
import React from 'react';
import { RouteObject } from 'react-router-dom';
import CardGallery from '@/pages/CardGallery';
import CardDetail from '@/pages/CardDetail';
import CardDetector from '@/pages/CardDetector';
import CardShowcase from '@/pages/CardShowcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CardCreator from '@/pages/CardCreator';
import UniformTextureDemo from '@/pages/UniformTextureDemo';
import ImmersiveCardViewer from '@/pages/ImmersiveCardViewer';
import Editor from '@/pages/Editor';
import CardCreatorPage from '@/pages/CardCreatorPage';

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
    path: "/cards/effects",
    element: <CardGallery />, // Should be implemented as a dedicated page
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
    path: "/card-maker",
    element: <ProtectedRoute><CardCreatorPage /></ProtectedRoute>,
  },
  {
    path: "/edit/:id",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/card-editor/:id?",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/card-creator",
    element: <ProtectedRoute><CardCreator /></ProtectedRoute>,
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
    path: "/uniforms",
    element: <UniformTextureDemo />,
  },
  {
    path: "/view/:id",
    element: <ImmersiveCardViewer />,
  }
];

export default cardRoutes;
