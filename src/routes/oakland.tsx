
import React from 'react';
import { RouteObject } from 'react-router-dom';
import OaklandMemoryCreator from '@/components/oakland/OaklandMemoryCreator';

// Oakland-specific routes
export const oaklandRoutes: RouteObject[] = [
  {
    path: "/oakland/create",
    element: <div className="container mx-auto px-4 py-8"><OaklandMemoryCreator /></div>
  },
  {
    path: "/oakland/gallery", 
    element: <div className="container mx-auto px-4 py-8"><div className="text-center text-gray-600">Oakland Community Gallery - Coming Soon</div></div>
  }
];
