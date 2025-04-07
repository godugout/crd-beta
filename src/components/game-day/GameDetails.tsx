
import React from 'react';
import { MapPin, Clock, Users, CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface GameInfo {
  opponent: string;
  date: string;
  time: string;
  isHomeGame: boolean;
}

interface StadiumInfo {
  name: string;
  location: string;
  team: string;
  section?: string;
  weatherConditions?: string;
  weatherIcon?: string;
  weatherTemp?: number;
}

interface GameDetailsProps {
  gameInfo: GameInfo;
  stadiumInfo?: StadiumInfo;
}

const GameDetails: React.FC<GameDetailsProps> = ({ gameInfo, stadiumInfo }) => {
  return (
    <div className="space-y-6">
      {/* Game Information */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-2">Today's Game</h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center">
              <span className={gameInfo.isHomeGame ? 'text-[#006341]' : 'text-gray-700'}>
                A's
              </span>
              <span className="mx-2">vs</span>
              <span className={!gameInfo.isHomeGame ? 'text-[#006341]' : 'text-gray-700'}>
                {gameInfo.opponent}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{gameInfo.date}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{gameInfo.time}</span>
          </div>
        </div>
        
        {gameInfo.isHomeGame && stadiumInfo && (
          <div className="mb-4 text-sm">
            <div className="flex items-center mb-1">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <span>{stadiumInfo.name}</span>
              {stadiumInfo.section && (
                <>
                  <span className="mx-1">•</span>
                  <span className="font-medium">Section {stadiumInfo.section}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              {stadiumInfo.weatherIcon && (
                <span className="mr-2 text-base">{stadiumInfo.weatherIcon}</span>
              )}
              {stadiumInfo.weatherTemp && (
                <span className="mr-2">{stadiumInfo.weatherTemp}°F</span>
              )}
              {stadiumInfo.weatherConditions && (
                <span className="text-gray-600">{stadiumInfo.weatherConditions}</span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="text-xs h-8">Game Stats</Button>
          <Button size="sm" variant="outline" className="text-xs h-8">Game Day Info</Button>
          <Button size="sm" variant="outline" className="text-xs h-8">Promotions</Button>
        </div>
      </Card>
      
      {/* Stadium Map & Information */}
      {stadiumInfo && (
        <Card className="overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {/* This would be a real map in production */}
            <div className="text-center text-gray-500">
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              <p>Stadium Map</p>
              {stadiumInfo.section && (
                <p className="text-sm mt-1">Section {stadiumInfo.section} highlighted</p>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold mb-2">Stadium Information</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Team</span>
                <span className="font-medium">{stadiumInfo.team}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
                <span className="font-medium">{stadiumInfo.location}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-600">Nearest Gates</span>
                <span className="font-medium">C, D</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Nearest Food</span>
                <span className="font-medium">Section 116, 120</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Nearby Restrooms</span>
                <span className="font-medium">Behind Section 121</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full text-sm" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Nearby Fans */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Nearby A's Fans</h3>
          <Button variant="ghost" size="sm">See All</Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            Connect with 7 A's fans who are also creating memories today
          </span>
        </div>
        
        <Button 
          className="w-full mt-4" 
          variant="default" 
          size="sm"
        >
          Share Your Section
        </Button>
      </Card>
    </div>
  );
};

export default GameDetails;
