
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole } from '@/lib/types';

// Import dashboard components based on user role
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  
  // For demo purposes, create a mock user if none exists
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setDashboardUser(user);
      } else {
        // Mock user for demo purposes
        const mockUser: User = {
          id: 'mock-user-id',
          email: 'user@example.com',
          name: 'Demo User',
          displayName: 'Demo User',
          role: UserRole.CREATOR, // Default to creator role
          avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DU',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDashboardUser(mockUser);
      }
      setDashboardLoaded(true);
    }
  }, [user, isLoading]);

  if (isLoading || !dashboardLoaded) {
    return <div className="container mx-auto p-6">Loading dashboard...</div>;
  }
  
  if (!dashboardUser) {
    return <div className="container mx-auto p-6">Please sign in to view your dashboard.</div>;
  }

  // Render the appropriate dashboard based on user role
  return (
    <div className="container mx-auto p-6">
      {dashboardUser.role === UserRole.ADMIN && <AdminDashboard user={dashboardUser} />}
      
      {dashboardUser.role === UserRole.CREATOR && <ArtistDashboard user={dashboardUser} />}
      
      {dashboardUser.role === UserRole.USER && <FanDashboard user={dashboardUser} />}
      
      {!dashboardUser.role && <FanDashboard user={dashboardUser} />}
    </div>
  );
};

export default Dashboard;
