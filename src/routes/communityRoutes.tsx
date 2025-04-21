
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TownCommunityHub from '@/pages/TownCommunityHub';

// Community routes focused only on shared community features
export const communityRoutes: RouteObject[] = [
  {
    path: '/community',
    element: <TownCommunityHub />
  }
];
