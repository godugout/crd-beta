
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Main application routes (home, auth, etc.)
export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  // 404 catch-all route
  {
    path: "*",
    element: <NotFound />,
  }
];
