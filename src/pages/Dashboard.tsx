
import React from 'react';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Image, Collection, Users, Star } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <PageLayout title="Dashboard" description="Your personalized dashboard">
        <Container className="py-8">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard" description="Your personalized dashboard">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.displayName || user.name || 'there'}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your cards and collections.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 flex-wrap">
            <Button asChild>
              <Link to="/cards/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Card
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/cards/create" className="no-underline">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Image className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Create New Card</CardTitle>
                <CardDescription>Design and publish a new digital card</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Upload images, customize with effects, and share with others.
              </CardContent>
            </Card>
          </Link>
          <Link to="/collections/create" className="no-underline">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Collection className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Start a Collection</CardTitle>
                <CardDescription>Organize your cards into collections</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Group related cards and share them as a collection.
              </CardContent>
            </Card>
          </Link>
          <Link to="/teams" className="no-underline">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Users className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Join a Team</CardTitle>
                <CardDescription>Collaborate with other collectors</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Find teams with similar interests and collaborate.
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Your most recent actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <Button variant="outline" className="mt-4">
                <Star className="mr-2 h-4 w-4" />
                Explore featured cards
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </PageLayout>
  );
};

export default Dashboard;
