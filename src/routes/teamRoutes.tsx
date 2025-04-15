
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Teams from '@/pages/Teams';
import TeamDetail from '@/pages/TeamDetail';
import TeamGallery from '@/pages/TeamGallery';
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import TeamPage from '@/pages/TeamPage'; // Import TeamPage component
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Team-related routes
export const teamRoutes: RouteObject[] = [
  {
    path: "/teams",
    element: <Teams />, // This will use the Teams component
  },
  {
    path: "/teams/sf-giants",
    element: <TeamDetail />, // Should be updated with proper ID
  },
  {
    path: "/teams/:teamId/gallery",
    element: <ProtectedRoute><TeamGallery /></ProtectedRoute>,
  },
  {
    path: "/teams/:teamId",
    element: <ProtectedRoute><TeamDetail /></ProtectedRoute>,
  },
  {
    path: "/teams/oakland/memories",
    element: <OaklandMemories />,
  },
  {
    path: "/teams/oakland/memories/:id",
    element: <OaklandMemoryDetail />,
  },
];
