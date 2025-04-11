
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
import OaklandMemories from '@/pages/oakland/OaklandMemories';
import OaklandMemoryDetail from '@/pages/oakland/OaklandMemoryDetail';
import CardCreationFlow from '@/components/card-editor/CardCreationFlow';
import CardCreatorPage from '@/pages/CardCreatorPage';
import BaseballCardViewer from '@/pages/BaseballCardViewer';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import Unauthorized from '@/pages/Unauthorized';
import CardShowcase from '@/pages/CardShowcase';
import Collections from '@/pages/Collections';
import Teams from '@/pages/Teams';
import Community from '@/pages/Community';
import GameDay from '@/pages/GameDay';
import Labs from '@/pages/Labs';
import Packs from '@/pages/Packs';
import Search from '@/pages/Search';
import Index from '@/pages/Index';

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/cards",
    element: <CardShowcase />,
  },
  {
    path: "/collections",
    element: <Collections />,
  },
  {
    path: "/teams",
    element: <Teams />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/game-day",
    element: <GameDay />,
  },
  {
    path: "/labs",
    element: <Labs />,
  },
  {
    path: "/packs",
    element: <Packs />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  
  // Protected routes
  {
    path: "/editor",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/editor/:id",
    element: <ProtectedRoute><Editor /></ProtectedRoute>,
  },
  {
    path: "/teams/:teamId/gallery",
    element: <ProtectedRoute><TeamGallery /></ProtectedRoute>,
  },
  {
    path: "/teams/:teamId",
    element: <ProtectedRoute><TeamDetail /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
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
    element: <ProtectedRoute><CardDetector /></ProtectedRoute>,
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
    element: <ProtectedRoute><CardCreationFlow /></ProtectedRoute>,
  },
  
  // Card Creator routes
  {
    path: "/card-creator",
    element: <CardCreatorPage />,
  },
  {
    path: "/cards/create",
    element: <ProtectedRoute><CardCreatorPage /></ProtectedRoute>,
  },
  {
    path: "/card/create",
    element: <ProtectedRoute><CardCreatorPage /></ProtectedRoute>,
  },
  
  // Baseball Card Viewer routes
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
].map(route => ({
  ...route,
  element: <GlobalErrorBoundary>{route.element}</GlobalErrorBoundary>
})));

export default router;
