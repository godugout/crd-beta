
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TeamPage from '@/pages/TeamPage';
import TownPage from '@/pages/TownPage';
import TownGallery from '@/pages/TownGallery';
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import TownCommunityHub from '@/pages/TownCommunityHub';
import TeamDirectory from '@/pages/TeamDirectory';

export const communityRoutes: RouteObject[] = [
  {
    path: '/community',
    element: <TownCommunityHub />
  },
  {
    path: '/teams',
    element: <TeamDirectory />
  },
  {
    path: '/teams/:teamId',
    element: <TeamPage />
  },
  {
    path: '/towns',
    element: <TownGallery />
  },
  {
    path: '/towns/:townId',
    element: <TownPage />
  },
  {
    path: '/towns/oakland/memories',
    element: <OaklandMemories />
  },
  {
    path: '/towns/oakland/memories/:id',
    element: <OaklandMemoryDetail />
  }
];

