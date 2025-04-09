
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, Map, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const GameDayMode = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  
  const modes = [
    {
      id: 'capture',
      title: 'Capture Moments',
      description: 'Take photos of game action, memorable plays, and stadium experiences',
      icon: <Camera className="h-12 w-12 text-blue-500 mb-2" />,
      action: 'Start Capturing'
    },
    {
      id: 'schedule',
      title: 'Game Schedule',
      description: 'View upcoming games and set reminders for your favorite teams',
      icon: <Calendar className="h-12 w-12 text-green-500 mb-2" />,
      action: 'View Schedule'
    },
    {
      id: 'stadium',
      title: 'Stadium Map',
      description: 'Interactive stadium maps with concessions, restrooms, and special features',
      icon: <Map className="h-12 w-12 text-purple-500 mb-2" />,
      action: 'Open Map'
    },
    {
      id: 'social',
      title: 'Fan Zone',
      description: 'Connect with other fans, share your photos, and join the conversation',
      icon: <Users className="h-12 w-12 text-orange-500 mb-2" />,
      action: 'Join Now'
    }
  ];
  
  const handleActivateMode = (modeId: string) => {
    setActiveMode(modeId);
    // In a real implementation, this would navigate to the specific mode or open a modal
  };

  return (
    <PageLayout
      title="Game Day Mode"
      description="Enhance your live game experience"
    >
      <div 
        className="container mx-auto px-4 py-8"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url("/images/stadium-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem',
          padding: '3rem 1rem',
          marginTop: '1rem'
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Game Day Mode</h1>
          <p className="text-xl mb-8">
            Enhance your ballpark experience with special features for game day
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {modes.map((mode) => (
              <Card key={mode.id} className="bg-white/95 backdrop-blur transition-all hover:shadow-lg">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center">{mode.icon}</div>
                  <CardTitle>{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-center">
                  <Button onClick={() => handleActivateMode(mode.id)}>{mode.action}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GameDayMode;
