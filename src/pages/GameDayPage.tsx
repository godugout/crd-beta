
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const GameDayPage = () => {
  return (
    <PageLayout 
      title="Game Day Mode | CardShow" 
      description="Enhanced experience during live games"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Game Day Mode</h1>
            <p className="text-muted-foreground mt-1">
              Enhanced experience for creating memories during live games
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="mr-2 h-4 w-4" />
              View Today's Games
            </Button>
          </div>
        </div>
        
        <div className="bg-card border rounded-xl p-8 mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <Star className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Game Day Features</h2>
            <p className="mb-6 text-muted-foreground">
              Game Day Mode enhances your experience during live games with real-time updates,
              special card creation tools, and exclusive content.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-background">
                <h3 className="font-medium">Live Score Updates</h3>
                <p className="text-sm text-muted-foreground">Track game progress in real-time</p>
              </div>
              <div className="border rounded-lg p-4 bg-background">
                <h3 className="font-medium">Memory Capture</h3>
                <p className="text-sm text-muted-foreground">Save special moments instantly</p>
              </div>
              <div className="border rounded-lg p-4 bg-background">
                <h3 className="font-medium">Game-Themed Templates</h3>
                <p className="text-sm text-muted-foreground">Special card designs for game day</p>
              </div>
              <div className="border rounded-lg p-4 bg-background">
                <h3 className="font-medium">Community Feed</h3>
                <p className="text-sm text-muted-foreground">Share experiences with other fans</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No Active Games</h3>
          <p className="text-muted-foreground mb-4">There are no live games in progress right now</p>
          <Button variant="outline">Check Upcoming Schedule</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default GameDayPage;
