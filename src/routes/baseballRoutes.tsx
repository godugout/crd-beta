
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TeamDirectory from '@/pages/TeamDirectory';
import BaseballCardViewer from '@/pages/BaseballCardViewer';
import ImmersiveBaseballViewer from '@/pages/ImmersiveBaseballViewer';

export const baseballRoutes: RouteObject[] = [
  {
    path: "/teams",
    element: <TeamDirectory />,
  },
  {
    path: "/cards/auctions/:id?",
    element: <BaseballCardViewer />,
  },
  {
    path: "/baseball-card-viewer/:id?",
    element: <ImmersiveBaseballViewer />,
  },
];
