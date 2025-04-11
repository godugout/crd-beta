
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import PopulateDatabase from '@/components/admin/PopulateDatabase';
import PageLayout from '@/components/navigation/PageLayout';
import ThemeManager from '@/components/admin/ThemeManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/lib/types/UserTypes';
import { TeamThemeProvider } from '@/context/ThemeContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Database, PaintBucket, Users } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('themes');
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <PageLayout 
        title="Access Denied"
        description="You don't have permission to access the admin area"
      >
        <Container className="py-12 max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need administrator privileges to access this page.
            </AlertDescription>
          </Alert>
        </Container>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout 
      title="Admin Tools"
      description="Tools for managing your card collection system"
    >
      <Container className="py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Tools</h1>
          <p className="text-gray-600 mt-2">Tools for managing your card collection system</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="themes">
              <PaintBucket className="h-4 w-4 mr-2" />
              Theme Management
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database Tools
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes">
            <TeamThemeProvider>
              <ThemeManager />
            </TeamThemeProvider>
          </TabsContent>
          
          <TabsContent value="database">
            <PopulateDatabase />
          </TabsContent>
          
          <TabsContent value="users">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-gray-500">User Management</h3>
              <p className="mt-2 text-gray-500">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default AdminPage;
