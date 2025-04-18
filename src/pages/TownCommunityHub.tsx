
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Users, MessageSquare, Calendar, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import useTeamsData from '@/hooks/useTeamsData';
import useTownGalleryData from '@/hooks/useTownGalleryData';
import TeamCard from '@/components/teams/TeamCard';
import TownGalleryCard from '@/components/towns/TownGalleryCard';

const TownCommunityHub = () => {
  const [activeTab, setActiveTab] = useState('towns');
  const { towns, loading: townsLoading, error: townsError } = useTownGalleryData();
  const { teams, isLoading: teamsLoading } = useTeamsData();

  return (
    <PageLayout
      title="Towns & Communities"
      description="Connect with local communities, towns, and teams"
    >
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Towns & Communities</h1>
            <p className="text-muted-foreground mt-1">Connect with local communities and teams</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link to="/towns/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Town
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="towns" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="towns" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Towns
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Towns Tab */}
          <TabsContent value="towns">
            {townsError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{townsError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {townsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="h-64">
                    <div className="animate-pulse h-full flex flex-col">
                      <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                      <CardHeader>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </CardHeader>
                    </div>
                  </Card>
                ))
              ) : towns.length > 0 ? (
                towns.map(town => (
                  <TownGalleryCard key={town.id} town={town} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No towns found</h3>
                  <p className="text-muted-foreground">Create a town to get started</p>
                  <Button asChild className="mt-4">
                    <Link to="/towns/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Town
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to="/towns">
                  <MapPin className="mr-2 h-4 w-4" />
                  View All Towns
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="h-64">
                    <div className="animate-pulse h-full flex flex-col">
                      <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                      <CardHeader>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </CardHeader>
                    </div>
                  </Card>
                ))
              ) : teams.length > 0 ? (
                teams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No teams found</h3>
                  <p className="text-muted-foreground">Create a team to get started</p>
                  <Button asChild className="mt-4">
                    <Link to="/teams/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Team
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Rookie Card Authentication Tips</CardTitle>
                    <CardDescription>Started by Alex Rodriguez • 3 days ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>What techniques do you use to authenticate rookie cards? I've been collecting for years but still struggle with some of the more obscure sets.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      24 replies
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      18 participants
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="text-center mt-6">
                <Button>View More Discussions</Button>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>San Francisco Card Exchange</CardTitle>
                    <CardDescription>August 12, 2025 • San Francisco, CA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Meet local collectors and trade cards at the monthly SF Card Exchange meetup.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>RSVP</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default TownCommunityHub;
