
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const mainRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/search',
    element: <Search />
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  }
];

