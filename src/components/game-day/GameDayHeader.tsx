
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StadiumInfo {
  name: string;
  location: string;
  team: string;
  section?: string;
}

interface GameInfo {
  opponent: string;
  date: string;
  time: string;
  isHomeGame: boolean;
}

interface GameDayHeaderProps {
  nearbyStadium?: StadiumInfo;
  stadiumSection?: string;
  isLocating: boolean;
  locationError?: Error | null;
  todayGameInfo: GameInfo;
}

const GameDayHeader: React.FC<GameDayHeaderProps> = ({
  nearbyStadium,
  stadiumSection,
  isLocating,
  locationError,
  todayGameInfo
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-r from-[#003831] to-[#006341] rounded-lg p-4 mb-4 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Game Day Mode</h1>
          <div className="flex items-center text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {isLocating ? (
              <span>Locating...</span>
            ) : locationError ? (
              <span>Location unavailable</span>
            ) : nearbyStadium ? (
              <span>{nearbyStadium.name} {stadiumSection ? `• Section ${stadiumSection}` : ''}</span>
            ) : (
              <span>Not at a stadium</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-white/10 border-white/20">
            {todayGameInfo.isHomeGame ? 'Home' : 'Away'}
          </Badge>
          <div className="flex items-center text-xs mt-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{todayGameInfo.time}</span>
          </div>
        </div>
      </div>
      
      {nearbyStadium && (
        <div className="mt-3 text-sm flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#EFB21E]">Today:</span> A's vs {todayGameInfo.opponent}
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 bg-white/10 hover:bg-white/20 border-none"
            onClick={() => navigate('/oakland/create')}
          >
            Create Memory
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameDayHeader;
