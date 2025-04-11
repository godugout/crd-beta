
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Camera, Calendar, Share2 } from 'lucide-react';

const GameDay = () => {
  const liveGames = [
    {
      id: 1,
      homeTeam: "Oakland A's",
      awayTeam: "SF Giants",
      homeScore: 3,
      awayScore: 2,
      inning: "6th",
      isLive: true
    },
    {
      id: 2,
      homeTeam: "LA Dodgers",
      awayTeam: "NY Yankees",
      homeScore: 1,
      awayScore: 4,
      inning: "8th",
      isLive: true
    }
  ];

  const upcomingGames = [
    {
      id: 3,
      homeTeam: "Chicago Cubs",
      awayTeam: "Boston Red Sox",
      date: "Tomorrow, 1:05 PM",
      isLive: false
    },
    {
      id: 4,
      homeTeam: "Houston Astros",
      awayTeam: "Texas Rangers",
      date: "Jun 15, 7:10 PM",
      isLive: false
    }
  ];

  return (
    <PageLayout
      title="Game Day | CardShow"
      description="Enhance your game-day experience with real-time updates and card creation"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Game Day Mode</h1>
          <p className="text-muted-foreground mt-1">Enhance your experience during live games with real-time updates and card creation</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Live Games</h2>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Full Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveGames.map(game => (
              <Card key={game.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-litmus-green/10 to-litmus-teal/10 p-2 flex justify-between items-center">
                  <Badge variant="secondary" className="bg-red-500 text-white">LIVE</Badge>
                  <span className="text-sm font-medium">Inning: {game.inning}</span>
                </div>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{game.homeTeam}</CardTitle>
                      <CardDescription>Home</CardDescription>
                    </div>
                    <div className="text-2xl font-bold">{game.homeScore}</div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <CardTitle>{game.awayTeam}</CardTitle>
                      <CardDescription>Away</CardDescription>
                    </div>
                    <div className="text-2xl font-bold">{game.awayScore}</div>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Enter Game Day
                  </Button>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Moment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingGames.map(game => (
              <Card key={game.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{game.homeTeam} vs {game.awayTeam}</CardTitle>
                  </div>
                  <CardDescription>{game.date}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                  <Button variant="ghost">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default GameDay;
