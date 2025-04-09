
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Image, Bookmark, MapPin, Upload } from 'lucide-react';

interface GameDayActionBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineItemsCount: number;
}

const GameDayActionBar: React.FC<GameDayActionBarProps> = ({
  activeTab,
  setActiveTab,
  offlineItemsCount
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3">
      <div className="grid grid-cols-5 gap-1">
        <Button 
          variant={activeTab === 'capture' ? 'default' : 'outline'} 
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => setActiveTab('capture')}
        >
          <Camera className="h-5 w-5 mb-1" />
          <span className="text-xs">Capture</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => navigate('/oakland/create')}
        >
          <Image className="h-5 w-5 mb-1" />
          <span className="text-xs">Memory</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => navigate('/gallery')}
        >
          <Bookmark className="h-5 w-5 mb-1" />
          <span className="text-xs">Gallery</span>
        </Button>
        
        <Button 
          variant={activeTab === 'gameinfo' ? 'default' : 'outline'} 
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => setActiveTab('gameinfo')}
        >
          <MapPin className="h-5 w-5 mb-1" />
          <span className="text-xs">Stadium</span>
        </Button>
        
        <Button 
          variant={activeTab === 'saved' ? 'default' : 'outline'} 
          className="h-16 flex flex-col items-center justify-center relative"
          onClick={() => setActiveTab('saved')}
        >
          {offlineItemsCount > 0 && (
            <Badge variant="destructive" className="absolute top-1 right-3 h-5 w-5 p-0 flex items-center justify-center">
              {offlineItemsCount}
            </Badge>
          )}
          <Upload className="h-5 w-5 mb-1" />
          <span className="text-xs">Saved</span>
        </Button>
      </div>
    </div>
  );
};

export default GameDayActionBar;
