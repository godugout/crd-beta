
import React from 'react';
import OaklandCardCreator from '@/components/oakland/OaklandCardCreator';
import ModernCardCreator from '@/components/oakland/modern/ModernCardCreator';
import OaklandTemplateLibrary from '@/components/oakland/OaklandTemplateLibrary';

export const oaklandRoutes = [
  {
    path: '/oakland/create',
    element: <ModernCardCreator />
  },
  {
    path: '/oakland/create-legacy',
    element: <OaklandCardCreator />
  },
  {
    path: '/oakland/templates',
    element: <OaklandTemplateLibrary />
  }
];
