
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/collections/detail';
import Gallery from '@/pages/Gallery';
import Packs from '@/pages/Packs';
import MemoryPackDetail from '@/pages/MemoryPackDetail';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Collection-related routes
export const collectionRoutes: RouteObject[] = [
  {
    path: "/collections",
    element: <Collections />,
  },
  {
    path: "/collections/featured",
    element: <Collections />, // Should be implemented as a dedicated page
  },
  {
    path: "/collections/:id",
    element: <CollectionDetail />,
  },
  {
    path: "/collection/:id", // Kept for backwards compatibility
    element: <CollectionDetail />,
  },
  {
    path: "/collections/create",
    element: <ProtectedRoute><Collections /></ProtectedRoute>, // Should be updated with proper create view
  },
  {
    path: "/collections/new",
    element: <ProtectedRoute><Collections /></ProtectedRoute>, // Should be updated with proper create view
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/packs",
    element: <Packs />,
  },
  {
    path: "/packs/:id",
    element: <MemoryPackDetail />,
  },
];
