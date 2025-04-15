
import React from 'react';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, MapPin, User, Star, Clock } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <PageLayout title="Profile" description="User profile">
        <Container className="py-8">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Format date to be human-readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PageLayout title="Profile" description="User profile">
      <Container className="py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* User Profile Card */}
          <Card className="lg:col-span-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName || user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.charAt(0) || user.name?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.displayName || user.name}</CardTitle>
              <CardDescription className="flex justify-center items-center gap-1">
                <User size={14} className="text-muted-foreground" />
                <span>{user.username || user.email.split('@')[0]}</span>
                {user.role && (
                  <Badge className="ml-2" variant="outline">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.bio && (
                  <div className="text-sm text-center">
                    {user.bio}
                  </div>
                )}
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Content Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="cards">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cards">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Cards</CardTitle>
                    <CardDescription>Cards you've created or collected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No cards to display yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="collections">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Collections</CardTitle>
                    <CardDescription>Collections you've created</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No collections to display yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent activity</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Profile;
