
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole, UserPermission } from '@/lib/types';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import { UserProfile } from '@/lib/types/user';

// Import dashboard components based on user role
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const user = auth.user;
  // Check for loading in either auth context format
  const isLoading = auth.loading || auth.isLoading || false;
  
  const [dashboardUser, setDashboardUser] = useState<UserProfile | null>(null);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  
  // Mock admin credentials for demo purposes
  const adminCredentials = {
    email: "user@example.com",
    password: "#LGO!"
  };
  
  // Helper function to convert User to UserProfile
  const userToProfile = (user: User): UserProfile => {
    return {
      id: user.id,
      userId: user.id,
      bio: user.bio,
      role: user.role || UserRole.USER,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
  
  // For demo purposes, create a mock user if none exists
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Convert User to UserProfile
        const profile = userToProfile(user);
        setDashboardUser(profile);
      } else {
        // Mock user for demo purposes
        const mockProfile: UserProfile = {
          id: 'mock-user-id',
          userId: 'mock-user-id',
          role: UserRole.ADMIN, // Default to admin role if password is correct
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDashboardUser(mockProfile);
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
