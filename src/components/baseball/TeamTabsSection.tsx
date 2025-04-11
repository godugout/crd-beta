
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaintBucket, Clock } from 'lucide-react';
import { Team } from '@/lib/types/BaseballTypes';
import TeamColorHistory from '@/components/baseball/TeamColorHistory';
import TeamColorCard from './TeamColorCard';

interface TeamTabsSectionProps {
  team: Team;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TeamTabsSection: React.FC<TeamTabsSectionProps> = ({ team, activeTab, setActiveTab }) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="colors">
            <PaintBucket className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Clock className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="mt-6">
          <TeamColorHistory team={team} />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.colorHistory.map((color, index) => (
              <TeamColorCard
                key={`${color.year}-${index}`}
                year={color.year}
                background={color.background}
                text={color.text}
                nickname={team.nickname || team.name}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium text-gray-500">Team History</h3>
            <p className="mt-2 text-gray-500">Coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium text-gray-500">Team Statistics</h3>
            <p className="mt-2 text-gray-500">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamTabsSection;
