
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Calendar, Award } from 'lucide-react';

const Community = () => {
  return (
    <PageLayout
      title="Community | CardShow"
      description="Connect with other collectors and enthusiasts"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">Connect with other collectors and enthusiasts</p>
        </div>

        <Tabs defaultValue="discussions">
          <TabsList className="mb-6">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

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
              
              <Button className="w-full">View More Discussions</Button>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>San Francisco Card Exchange</CardTitle>
                    <CardDescription>August 12, 2024 • San Francisco, CA</CardDescription>
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

          <TabsContent value="challenges">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>June Collection Challenge</CardTitle>
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <CardDescription>Ends in 3 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Create a collection of 10 cards featuring rookie players from this season.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Join Challenge</Button>
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

export default Community;
