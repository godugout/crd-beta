
import React, { useState } from 'react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Users, Grid, BarChart3, ShieldCheck, Settings, Plus, Database, Image
} from 'lucide-react';
import MediaManagerPanel from '@/components/dashboard/MediaManagerPanel';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const { cards, series, decks } = useEnhancedCards();
  const [activeTab, setActiveTab] = useState('media');

  // Sample user data (in a real app, this would be fetched from an API)
  const users = [
    { id: 'user-1', name: 'Jane Cooper', email: 'jane@example.com', role: 'artist' },
    { id: 'user-2', name: 'John Doe', email: 'john@example.com', role: 'fan' },
    { id: 'user-3', name: 'Robert Smith', email: 'robert@example.com', role: 'artist' },
    { id: 'user-4', name: 'Emily Johnson', email: 'emily@example.com', role: 'fan' },
  ];
  
  // For a real app, these would be actual statistics
  const statsData = {
    totalUsers: users.length,
    artistCount: users.filter(u => u.role === 'artist').length,
    fanCount: users.filter(u => u.role === 'fan').length,
    totalCards: cards.length,
    totalSeries: series.length,
    totalDecks: decks.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users, content, and platform settings</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Featured Content
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Platform Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{statsData.totalUsers}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+2</span> in the last 24 hours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Artists / Fans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {statsData.artistCount} / {statsData.fanCount}
            </div>
            <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ 
                  width: `${(statsData.artistCount / statsData.totalUsers) * 100}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{statsData.totalCards}</div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{statsData.totalSeries} Series</span>
              <span>{statsData.totalDecks} Decks</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
          <TabsTrigger value="media"><Image className="mr-2 h-4 w-4" />Media</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="content"><Grid className="mr-2 h-4 w-4" />Content</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="media" className="mt-6">
          <MediaManagerPanel />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'artist' 
                              ? 'bg-blue-100 text-blue-800' 
                              : user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select cards and series to feature on the homepage
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {cards.slice(0, 4).map(card => (
                    <div key={card.id} className="flex items-center space-x-2">
                      <div className="w-12 h-16 rounded overflow-hidden">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{card.title}</p>
                        <p className="text-xs text-muted-foreground">{card.rarity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  Manage Featured Content
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Review and approve new content submissions
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Reviews</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                      3 items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reported Content</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      1 item
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Approved Today</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      12 items
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  View Moderation Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Platform usage metrics and growth trends
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Users Growth</h4>
                  <div className="h-10 bg-slate-100 rounded-md overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Last month: 42</span>
                    <span>This month: 68</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Content Creation</h4>
                  <div className="h-10 bg-slate-100 rounded-md overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: '40%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Last month: 78</span>
                    <span>This month: 104</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Platform Engagement</h4>
                  <div className="h-10 bg-slate-100 rounded-md overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Last month: 1,245</span>
                    <span>This month: 2,312</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-6" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
