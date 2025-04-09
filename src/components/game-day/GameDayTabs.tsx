
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface GameDayTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineItemsCount: number;
}

const GameDayTabs: React.FC<GameDayTabsProps> = ({
  activeTab,
  setActiveTab,
  offlineItemsCount
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="capture">Capture</TabsTrigger>
        <TabsTrigger value="gameinfo">Game Info</TabsTrigger>
        <TabsTrigger value="saved">
          Saved
          {offlineItemsCount > 0 && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {offlineItemsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default GameDayTabs;
