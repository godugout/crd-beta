
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/collections/detail';
import Gallery from '@/pages/Gallery';
import Packs from '@/pages/Packs';
import MemoryPackDetail from '@/pages/MemoryPackDetail';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import InstagramCollectionPage from '@/pages/collections/instagram';

// Collection-related routes
export const collectionRoutes: RouteObject[] = [
  {
    path: "/collections",
    element: <Collections />,
  },
  {
    path: "/collections/featured",
    element: <Collections />,
  },
  {
    path: "/collections/:id",
    element: <CollectionDetail />,
  },
  {
    path: "/collections/create",
    element: <ProtectedRoute><Collections /></ProtectedRoute>,
  },
  {
    path: "/collections/new",
    element: <ProtectedRoute><Collections /></ProtectedRoute>,
  },
  {
    path: "/collections/instagram",
    element: <ProtectedRoute><InstagramCollectionPage /></ProtectedRoute>,
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

