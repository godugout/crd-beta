
import React from 'react';
import { RouteObject } from 'react-router-dom';
import GameDay from '@/pages/GameDay';
import Labs from '@/pages/Labs';
import BaseballCardViewer from '@/pages/BaseballCardViewer';
import PbrDemo from '@/pages/PbrDemo';
import CardViewerExperimental from '@/pages/CardViewerExperimental';

// Feature-specific routes
export const featureRoutes: RouteObject[] = [
  {
    path: "/game-day",
    element: <GameDay />,
  },
  {
    path: "/labs",
    element: <Labs />,
  },
  {
    path: "/labs/pbr",
    element: <PbrDemo />,
  },
  {
    path: "/labs/card-viewer/:id",
    element: <CardViewerExperimental />,
  },
  {
    path: "/ar-viewer",
    element: <BaseballCardViewer />,
  },
  {
    path: "/baseball-card-viewer",
    element: <BaseballCardViewer />,
  },
  {
    path: "/baseball-card-viewer/:id",
    element: <BaseballCardViewer />,
  },
];
