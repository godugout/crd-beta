import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/auth';
import { CardProvider } from '@/context/CardContext';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import CardGallery from '@/pages/CardGallery';
import CollectionDetail from '@/pages/CollectionDetail';
import Collections from '@/pages/Collections';
import OaklandMemories from '@/pages/OaklandMemories';
import OaklandMemoryCreatorPage from '@/pages/OaklandMemoryCreator';
import Experiences from '@/pages/Experiences';

// Import our new Media Library page
import MediaLibrary from '@/pages/MediaLibrary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/cards/create',
    element: <Editor />,
  },
  {
    path: '/gallery',
    element: <CardGallery />,
  },
  {
    path: '/collections/:id',
    element: <CollectionDetail />,
  },
  {
    path: '/collections',
    element: <Collections />,
  },
  {
    path: '/oakland-memories',
    element: <OaklandMemories />,
  },
  {
    path: '/oakland-memories/create',
    element: <OaklandMemoryCreatorPage />,
  },
  {
    path: '/experiences',
    element: <Experiences />,
  },
  
  // Add Media Library route
  {
    path: '/media',
    element: <MediaLibrary />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <CardProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </CardProvider>
    </AuthProvider>
  );
};

export default App;
