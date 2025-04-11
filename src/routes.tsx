
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery'; 
import CardGallery from '@/pages/CardGallery';
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
import MemoryPackDetail from '@/pages/MemoryPackDetail';
import { BreadcrumbProvider } from '@/hooks/breadcrumbs/BreadcrumbContext';

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
    element: <CardGallery />,
  },
  {
    path: "/cards/effects",
    element: <CardGallery />, // Should be implemented as a dedicated page
  },
  {
    path: "/collections",
    element: <Collections />,
  },
  {
    path: "/collections/featured",
    element: <Collections />, // Should be implemented as a dedicated page
  },
  {
    path: "/teams",
    element: <Teams />,
  },
  {
    path: "/teams/sf-giants",
    element: <TeamDetail />, // Should be updated with proper ID
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
    path: "/packs/:id",
    element: <MemoryPackDetail />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/detector",
    element: <CardDetector />,
  },
  {
    path: "/ar-viewer",
    element: <BaseballCardViewer />,
  },
  {
    path: "/animation",
    element: <CardShowcase />, // Should be implemented as a dedicated page
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
  // Standardize to collections/id for consistency
  {
    path: "/collection/:id",
    element: <CollectionDetail />,
  },
  {
    path: "/collections/:id",
    element: <CollectionDetail />,
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
  {
    path: "/collections/create",
    element: <ProtectedRoute><Collections /></ProtectedRoute>, // Should be updated with proper create view
  },
  {
    path: "/collections/new",
    element: <ProtectedRoute><Collections /></ProtectedRoute>, // Should be updated with proper create view
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
  element: (
    <BreadcrumbProvider>
      <GlobalErrorBoundary>{route.element}</GlobalErrorBoundary>
    </BreadcrumbProvider>
  )
})));

export default router;
