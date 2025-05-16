
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModerationDashboard from '@/components/ugc/ModerationDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('moderation');
  const { isAdmin = true } = useAuth(); // In a real app, this would check if user is admin
  
  return (
    <PageLayout
      title="Admin Dashboard"
      description="Manage and moderate user-generated content"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <AdminNavItem 
                    icon={<Shield className="h-4 w-4" />} 
                    label="Content Moderation"
                    active={activeTab === 'moderation'}
                    onClick={() => setActiveTab('moderation')}
                  />
                  <AdminNavItem 
                    icon={<Users className="h-4 w-4" />} 
                    label="User Management"
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                  />
                  <AdminNavItem 
                    icon={<BarChart className="h-4 w-4" />} 
                    label="Analytics"
                    active={activeTab === 'analytics'}
                    onClick={() => setActiveTab('analytics')}
                  />
                  <AdminNavItem 
                    icon={<Settings className="h-4 w-4" />} 
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Pending Moderation</p>
                    <p className="text-lg font-semibold">12</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Open Reports</p>
                    <p className="text-lg font-semibold">5</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Active Users</p>
                    <p className="text-lg font-semibold">1,254</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <TabsContent value="moderation" className="mt-0">
              <ModerationDashboard isAdmin={isAdmin} />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                  <p className="text-muted-foreground">
                    User management features are under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                  <p className="text-muted-foreground">
                    Analytics features are under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                  <p className="text-muted-foreground">
                    Settings features are under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Admin navigation item component
interface AdminNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 w-full rounded-md text-sm transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default AdminDashboardPage;
