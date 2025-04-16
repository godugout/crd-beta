
import React from 'react';
import { RouteObject } from 'react-router-dom';
import BaseballArchive from '@/pages/BaseballArchive';
import BaseballCardViewer from '@/pages/BaseballCardViewer';

export const baseballRoutes: RouteObject[] = [
  {
    path: "/baseball-archive",
    element: <BaseballArchive />,
  },
  {
    path: "/cards/auctions/:id?",
    element: <BaseballCardViewer />,
  },
];
