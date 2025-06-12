
import React from 'react';
import OaklandCardCreator from '@/components/oakland/OaklandCardCreator';
import ModernCardCreator from '@/components/oakland/modern/ModernCardCreator';
import OaklandTemplateLibrary from '@/components/oakland/OaklandTemplateLibrary';
import OaklandMemoryBuilder from '@/components/oakland/OaklandMemoryBuilder';

export const oaklandRoutes = [
  {
    path: '/oakland/memory-builder',
    element: <OaklandMemoryBuilder />
  },
  {
    path: '/oakland/create',
    element: <OaklandMemoryBuilder />
  },
  {
    path: '/oakland/create-modern',
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
