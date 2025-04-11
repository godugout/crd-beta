
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { UserProfile } from '@/lib/types/UserTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // For demo purposes, let's create a mock user profile with role
  // In a real app, the role would be fetched from the database
  const mockUserProfile: UserProfile = user ? {
    ...user,
    role: user.email?.includes('admin') ? 'admin' : 
          user.email?.includes('artist') ? 'artist' : 'fan'
  } : null;
  
  if (isLoading) {
    return (
      <PageLayout title="Dashboard" description="Your personalized dashboard">
        <DashboardSkeleton />
      </PageLayout>
    );
  }
  
  if (!user) {
    return (
      <PageLayout title="Dashboard" description="Your personalized dashboard">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your dashboard
            </p>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title="Dashboard"
      description="Your personalized dashboard"
    >
      <CardEnhancedProvider>
        <div className="container mx-auto px-4 py-8">
          {mockUserProfile?.role === 'admin' && (
            <AdminDashboard user={mockUserProfile} />
          )}
          
          {mockUserProfile?.role === 'artist' && (
            <ArtistDashboard user={mockUserProfile} />
          )}
          
          {mockUserProfile?.role === 'fan' && (
            <FanDashboard user={mockUserProfile} />
          )}
          
          {!mockUserProfile?.role && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">Role Not Assigned</h2>
              <p className="text-gray-600 mb-8">
                Please contact an administrator to assign a role to your account
              </p>
            </div>
          )}
        </div>
      </CardEnhancedProvider>
    </PageLayout>
  );
};

// Skeleton loading state
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Skeleton className="h-10 w-32 inline-block" />
          <Skeleton className="h-10 w-32 inline-block" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      
      <div>
        <Skeleton className="h-10 w-96 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default Dashboard;
