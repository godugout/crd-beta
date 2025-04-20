
import React from 'react';
import { RouteObject } from 'react-router-dom';
import GameDayPage from '@/pages/GameDayPage';
import LabsPage from '@/pages/LabsPage';
import ArViewer from '@/pages/ArViewer';

const featureRoutes: RouteObject[] = [
  {
    path: "/game-day",
    element: <GameDayPage />
  },
  {
    path: "/labs",
    element: <LabsPage />
  },
  {
    path: "/features/game-day",
    element: <GameDayPage />
  },
  {
    path: "/features/labs",
    element: <LabsPage />
  },
  {
    path: "/ar-viewer",
    element: <ArViewer />
  }
];

export default featureRoutes;
