
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { cardRoutes } from './cardRoutes';
import { adminRoutes } from './adminRoutes';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />
  },
  ...cardRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <NotFoundPage />
  }
];
