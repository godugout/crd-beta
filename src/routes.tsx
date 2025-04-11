
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

// Import the new Card Creator page
import CardCreatorPage from '@/pages/CardCreatorPage';

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
  
  // Add our Card Creator route
  {
    path: "/card-creator",
    element: <CardCreatorPage />,
  },
  {
    path: "/cards/create",
    element: <CardCreatorPage />,
  }
]);

export default router;
