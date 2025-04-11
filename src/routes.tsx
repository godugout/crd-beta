
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Editor from '@/pages/Editor';
import TeamGallery from '@/pages/TeamGallery';
import TeamDetail from '@/pages/TeamDetail';
import Profile from '@/pages/Profile';
import CardDetail from '@/pages/CardDetail';
import CollectionDetail from '@/pages/CollectionDetail';
import CardDetector from '@/pages/CardDetector';
import OaklandMemories from '@/pages/OaklandMemories';
import OaklandMemoryDetail from '@/pages/OaklandMemoryDetail';
import CardCreationFlow from '@/components/card-editor/CardCreationFlow';
import CardCreatorPage from '@/pages/CardCreatorPage';
import BaseballCardViewer from '@/pages/BaseballCardViewer';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
  {
    path: "/editor/:id",
    element: <Editor />,
  },
  {
    path: "/teams/:teamId/gallery",
    element: <TeamGallery />,
  },
  {
    path: "/teams/:teamId",
    element: <TeamDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/card/:id",
    element: <CardDetail />,
  },
  {
    path: "/collection/:id",
    element: <CollectionDetail />,
  },
  {
    path: "/card-detector",
    element: <CardDetector />,
  },
  {
    path: "/teams/oakland/memories",
    element: <OaklandMemories />,
  },
  {
    path: "/teams/oakland/memories/:id",
    element: <OaklandMemoryDetail />,
  },
  {
    path: "/card-upload",
    element: <CardCreationFlow />,
  },
  
  // Card Creator routes
  {
    path: "/card-creator",
    element: <CardCreatorPage />,
  },
  {
    path: "/cards/create",
    element: <CardCreatorPage />,
  },
  {
    path: "/card/create",
    element: <CardCreatorPage />,
  },
  
  // Baseball Card Viewer routes - add proper parameter handling
  {
    path: "/baseball-card-viewer",
    element: <BaseballCardViewer />,
  },
  {
    path: "/baseball-card-viewer/:id",
    element: <BaseballCardViewer />,
  },
  
  // 404 catch-all route
  {
    path: "*",
    element: <NotFound />,
  }
]);

export default router;
