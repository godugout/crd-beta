
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/collections/detail';
import InstagramCollectionPage from '@/pages/collections/instagram';
import CommonsCardsPage from '@/pages/collections/commons';
import BasketballArtCollection from '@/pages/collections/BasketballArtCollection';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CollectionForm from '@/pages/CollectionForm';

export const collectionRoutes: RouteObject[] = [
  {
    path: '/collections',
    element: <Collections />
  },
  {
    path: '/collections/:id',
    element: <CollectionDetail />
  },
  {
    path: '/collections/create',
    element: <ProtectedRoute><Collections /></ProtectedRoute>
  },
  {
    path: '/collections/new',
    element: <ProtectedRoute><CollectionForm /></ProtectedRoute>
  },
  {
    path: '/collections/instagram',
    element: <ProtectedRoute><InstagramCollectionPage /></ProtectedRoute>
  },
  {
    path: '/collections/commons',
    element: <CommonsCardsPage />
  },
  {
    path: '/collections/basketball-art',
    element: <BasketballArtCollection />
  }
];

