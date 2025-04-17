
import React from 'react';
import { RouteObject } from 'react-router-dom';
// Import ProtectedRoute as default import
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Account from '@/components/Account';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import CardDetail from '@/pages/CardDetail';
import SeriesViewPage from '@/pages/SeriesViewPage';
import NotFound from '@/pages/NotFound'; // Use NotFound instead of MaintenancePage

export const mainRoutes: RouteObject[] = [
  {
    path: "/maintenance",
    element: <NotFound />, // Replace MaintenancePage with NotFound
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/register",
    element: <Auth />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/cards/:id",
    element: <CardDetail />,
  },
  {
    path: "/series/:id",
    element: <SeriesViewPage />,
  },
  
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>,
  },
];

// Export as default for apps that need to import it that way
export default mainRoutes;
