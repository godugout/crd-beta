
import React from 'react';
import { RouteObject } from 'react-router-dom';
import BaseballArchive from '@/pages/BaseballArchive';
import TeamDetail from '@/pages/TeamDetail';

const baseballRoutes: RouteObject[] = [
  {
    path: "/baseball-archive",
    element: <BaseballArchive />,
  },
  {
    path: "/baseball-archive/team/:teamId",
    element: <TeamDetail />,
  }
];

export default baseballRoutes;
