import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';
import { UserRole } from '@/lib/types/user';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4">
        <h2>Please log in to view your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user.role === UserRole.ADMIN && <AdminDashboard />}
      {user.role === UserRole.ARTIST && <ArtistDashboard />}
      {user.role === UserRole.USER && <FanDashboard />}
    </div>
  );
};

export default Dashboard;
