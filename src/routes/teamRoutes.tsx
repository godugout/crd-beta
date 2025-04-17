import React from 'react';
import { RouteObject } from 'react-router-dom';
import TeamPage from '@/pages/TeamPage';
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Team-related routes - simplified to only include Oakland and SF Giants teams
export const teamRoutes: RouteObject[] = [
  {
    path: "/teams/oakland",
    element: <TeamPage teamId="oakland" />,
  },
  {
    path: "/teams/sf-giants",
    element: <TeamPage teamId="sf-giants" />,
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
