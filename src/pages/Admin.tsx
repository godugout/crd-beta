
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import PageLayout from '@/components/navigation/PageLayout';
import LoadingState from '@/components/ui/loading-state';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Handle loading state
  if (isLoading) {
    return (
      <PageLayout title="Admin Dashboard" description="Administration area for Cardshow">
        <div className="container mx-auto px-4 py-8">
          <LoadingState size="lg" text="Loading admin dashboard..." />
        </div>
      </PageLayout>
    );
  }
  
  // Handle unauthorized access
  if (!user || user.role !== 'admin') {
    return (
      <PageLayout title="Unauthorized" description="Access denied">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
          <p className="mb-8 text-xl">You do not have permission to access the admin area.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Admin Dashboard" description="Administration area for Cardshow">
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard user={user} />
      </div>
    </PageLayout>
  );
};

export default Admin;
