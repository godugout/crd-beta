import React from 'react';
import { Route, Routes } from 'react-router-dom';
// Import ProtectedRoute as default import
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Account from '@/components/Account';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import CardDetail from '@/pages/CardDetail';
import SeriesViewPage from '@/pages/SeriesViewPage';
import MaintenancePage from '@/pages/MaintenancePage';

const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account" element={<Account />} />
      <Route path="/cards/:id" element={<CardDetail />} />
      <Route path="/series/:id" element={<SeriesViewPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
