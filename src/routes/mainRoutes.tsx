
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Gallery from '@/pages/Gallery';

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
    path: '/gallery',
    element: <Gallery />
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
