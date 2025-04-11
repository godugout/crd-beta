
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CalendarDays, Timer } from 'lucide-react';

const Packs = () => {
  const memoryPacks = [
    {
      id: 1,
      name: "Oakland Home Games 2023",
      description: "Memorable moments from Oakland home games in the 2023 season",
      cardCount: 24,
      coverImage: "https://placehold.co/600x400/092916/FFFFFF/png?text=Oakland+Home+Games",
      date: "2023"
    },
    {
      id: 2,
      name: "SF Giants Highlights",
      description: "Top plays and moments from Giants games",
      cardCount: 18,
      coverImage: "https://placehold.co/600x400/FD5A1E/FFFFFF/png?text=SF+Giants+Highlights",
      date: "2023"
    },
    {
      id: 3,
      name: "Baseball Legends",
      description: "Celebrating the greatest players in baseball history",
      cardCount: 12,
      coverImage: "https://placehold.co/600x400/0A2351/FFFFFF/png?text=Baseball+Legends",
      date: "All-time"
    }
  ];

  const limitedEditionPacks = [
    {
      id: 4,
      name: "Draft Day 2024",
      description: "Special edition cards featuring top draft picks",
      cardCount: 8,
      coverImage: "https://placehold.co/600x400/1A472A/FFFFFF/png?text=Draft+Day+2024",
      releaseDate: "June 20, 2024"
    },
    {
      id: 5,
      name: "World Series Special",
      description: "Cards commemorating the 2023 World Series",
      cardCount: 10,
      coverImage: "https://placehold.co/600x400/6F263D/FFFFFF/png?text=World+Series+Special",
      releaseDate: "Available Now"
    }
  ];

  return (
    <PageLayout
      title="Memory Packs | CardShow"
      description="Browse themed memory packs"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Memory Packs</h1>
          <p className="text-muted-foreground mt-1">Explore themed collections of memorable moments</p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Featured Packs</h2>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Create Pack
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoryPacks.map(pack => (
              <Card key={pack.id} className="overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${pack.coverImage})` }}
                >
                </div>
                <CardHeader>
                  <CardTitle>{pack.name}</CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Package className="h-4 w-4 mr-1" />
                    {pack.cardCount} cards
                    <span className="mx-2">•</span>
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {pack.date}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Pack</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Limited Edition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {limitedEditionPacks.map(pack => (
              <Card key={pack.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div 
                    className="h-48 md:h-auto md:w-1/3 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${pack.coverImage})` }}
                  ></div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle>{pack.name}</CardTitle>
                      <CardDescription>{pack.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mr-1" />
                        {pack.cardCount} cards
                        <span className="mx-2">•</span>
                        <Timer className="h-4 w-4 mr-1" />
                        {pack.releaseDate}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View Details</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Packs;
