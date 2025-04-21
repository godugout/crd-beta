
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TownPage from '@/pages/TownPage';
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import TownGallery from '@/pages/TownGallery';

// Town-related routes
export const townRoutes: RouteObject[] = [
  {
    path: "/towns",
    element: <TownGallery />,
  },
  {
    path: "/towns/:townId",
    element: <TownPage />,
  },
  {
    path: "/towns/oakland",
    element: <TownPage townId="oakland" />,
  },
  {
    path: "/towns/oakland/memories",
    element: <OaklandMemories />,
  },
  {
    path: "/towns/oakland/memories/:id",
    element: <OaklandMemoryDetail />,
  },
];
