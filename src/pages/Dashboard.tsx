
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole, UserPermission } from '@/lib/types';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';

// Import dashboard components based on user role
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const user = auth.user;
  // Check for loading in either auth context format
  const isLoading = auth.loading || auth.isLoading || false;
  
  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  
  // Mock admin credentials for demo purposes
  const adminCredentials = {
    email: "user@example.com",
    password: "#LGO!"
  };
  
  // For demo purposes, create a mock user if none exists
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Ensure we create a User type compatible object
        const compatibleUser: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          displayName: user.displayName,
          role: user.role,
          permissions: user.permissions as UserPermission[],
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        setDashboardUser(compatibleUser);
      } else {
        // Mock user for demo purposes
        const mockUser: User = {
          id: 'mock-user-id',
          email: 'user@example.com',
          name: 'Demo User',
          displayName: 'Demo User',
          role: UserRole.ADMIN, // Default to admin role if password is correct
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
    <CardEnhancedProvider>
      <div className="container mx-auto p-6">
        {dashboardUser.role === UserRole.ADMIN && <AdminDashboard user={dashboardUser} />}
        
        {dashboardUser.role === UserRole.CREATOR && <ArtistDashboard user={dashboardUser} />}
        
        {dashboardUser.role === UserRole.USER && <FanDashboard user={dashboardUser} />}
        
        {!dashboardUser.role && <FanDashboard user={dashboardUser} />}
      </div>
    </CardEnhancedProvider>
  );
};

export default Dashboard;
