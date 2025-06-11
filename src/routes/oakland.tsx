
import React from 'react';
import OaklandCardCreator from '@/components/oakland/OaklandCardCreator';
import OaklandTemplateLibrary from '@/components/oakland/OaklandTemplateLibrary';

export const oaklandRoutes = [
  {
    path: '/oakland/create',
    element: <OaklandCardCreator />
  },
  {
    path: '/oakland/templates',
    element: <OaklandTemplateLibrary />
  }
];
