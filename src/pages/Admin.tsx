
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from "@/components/ui/loading-state";
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { User, UserRole } from '@/lib/types';

// Define mock user for development
const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: UserRole.ADMIN,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};

const Admin = () => {
  // In a real app, you would check if the user is an admin
  const isAdmin = true;
  const isLoading = false;
  
  if (isLoading) {
    return <LoadingState text="Loading Admin Panel..." />;
  }
  
  if (!isAdmin) {
    return (
      <PageLayout title="Access Denied" description="You do not have permission to access the admin panel">
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access the admin panel.</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Admin Panel" description="Manage the CRD platform">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <AdminDashboard user={mockAdminUser} />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <div className="text-center py-16">
              <p className="text-gray-600">User management interface will be implemented here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="cards" className="mt-6">
            <div className="text-center py-16">
              <p className="text-gray-600">Card management interface will be implemented here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="series" className="mt-6">
            <div className="text-center py-16">
              <p className="text-gray-600">Series management interface will be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;
