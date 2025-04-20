import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { CardProvider } from './context/CardContext';
import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import Team from '@/pages/Team';
import Oakland from '@/pages/Oakland';
import ImmersiveCard from '@/pages/ImmersiveCard';
import { Auth } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Account from '@/pages/Account';
import CreateCard from '@/pages/CreateCard';
import CardDetail from '@/pages/CardDetail';
import CreateCollection from '@/pages/CreateCollection';
import CollectionDetail from '@/pages/CollectionDetail';
import EditCollection from '@/pages/EditCollection';
import EditCard from '@/pages/EditCard';
import TeamDashboard from '@/pages/TeamDashboard';
import TeamGallery from '@/pages/TeamGallery';
import TeamSettings from '@/pages/TeamSettings';
import TeamMembers from '@/pages/TeamMembers';
import TeamJoin from '@/pages/TeamJoin';
import OaklandMemories from '@/pages/OaklandMemories';
import OaklandMemoryDetail from '@/pages/OaklandMemoryDetail';
import OaklandCreateMemory from '@/pages/OaklandCreateMemory';
import OaklandEditMemory from '@/pages/OaklandEditMemory';
import Pricing from '@/pages/Pricing';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <CardProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/teams/:teamId" element={<Team />} />
            <Route path="/teams/oakland" element={<Oakland />} />
            <Route path="/immersive/:cardId" element={<ImmersiveCard />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards/create"
              element={
                <ProtectedRoute>
                  <CreateCard />
                </ProtectedRoute>
              }
            />
            <Route path="/cards/:cardId" element={<CardDetail />} />
            <Route
              path="/cards/:cardId/edit"
              element={
                <ProtectedRoute>
                  <EditCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections/create"
              element={
                <ProtectedRoute>
                  <CreateCollection />
                </ProtectedRoute>
              }
            />
            <Route path="/collections/:collectionId" element={<CollectionDetail />} />
            <Route
              path="/collections/:collectionId/edit"
              element={
                <ProtectedRoute>
                  <EditCollection />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teams/:teamId/dashboard"
              element={
                <ProtectedRoute>
                  <TeamDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/teams/:teamId/gallery" element={<TeamGallery />} />
            <Route
              path="/teams/:teamId/settings"
              element={
                <ProtectedRoute>
                  <TeamSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams/:teamId/members"
              element={
                <ProtectedRoute>
                  <TeamMembers />
                </ProtectedRoute>
              }
            />
            <Route path="/teams/join/:inviteCode" element={<TeamJoin />} />

            <Route path="/teams/oakland/memories" element={<OaklandMemories />} />
            <Route path="/teams/oakland/memories/:cardId" element={<OaklandMemoryDetail />} />
            <Route
              path="/teams/oakland/memories/create"
              element={
                <ProtectedRoute>
                  <OaklandCreateMemory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams/oakland/memories/:cardId/edit"
              element={
                <ProtectedRoute>
                  <OaklandEditMemory />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CardProvider>
    </HelmetProvider>
  );
}

function LoginPage() {
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  if (session) {
    return <Navigate to="/account" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In / Sign Up</h2>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={['github', 'google']}
        />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default App;
