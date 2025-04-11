
import React from 'react';
import { RouteObject } from 'react-router-dom';
import BaseballArchive from '@/pages/BaseballArchive';
import BaseballCardViewer from '@/pages/BaseballCardViewer';

// Baseball-related routes
export const baseballRoutes: RouteObject[] = [
  {
    path: "/baseball-archive",
    element: <BaseballArchive />,
  },
  {
    path: "/baseball-card-viewer/:id?",
    element: <BaseballCardViewer />,
  },
];
