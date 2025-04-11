
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { getTeamById, getTeamColorsForYear } from '@/data/baseballTeamColors';
import TeamColorHistory from '@/components/baseball/TeamColorHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, PaintBucket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('colors');
  
  const team = teamId ? getTeamById(teamId) : undefined;
  
  if (!team) {
    return (
      <PageLayout title="Team Not Found" description="The requested team could not be found">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate('/baseball-archive')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Archive
          </Button>
          
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold">Team Not Found</h1>
            <p className="mt-2 text-gray-600">The team you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Get current colors (most recent in history)
  const currentColors = team.colorHistory.length > 0 
    ? team.colorHistory.reduce((latest, current) => current.year > latest.year ? current : latest) 
    : null;
  
  return (
    <PageLayout title={team.fullName || team.name} description={`${team.fullName} team history and statistics`}>
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" onClick={() => navigate('/baseball-archive')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Archive
        </Button>
        
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{team.fullName || team.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Founded {team.founded}</span>
              </div>
            </div>
            
            {currentColors && (
              <div className="flex items-center mt-4 md:mt-0 gap-3">
                <div className="flex items-center">
                  <div 
                    className="w-5 h-5 rounded mr-2" 
                    style={{ backgroundColor: currentColors.background }}
                  />
                  <span className="text-sm font-mono">{currentColors.background}</span>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-5 h-5 rounded mr-2" 
                    style={{ backgroundColor: currentColors.text }}
                  />
                  <span className="text-sm font-mono">{currentColors.text}</span>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="h-48 mt-6 rounded-lg flex items-center justify-center"
            style={currentColors ? { 
              backgroundColor: currentColors.background
            } : undefined}
          >
            <h2 
              className="text-6xl font-bold tracking-tight"
              style={currentColors ? { color: currentColors.text } : undefined}
            >
              {team.nickname || team.name}
            </h2>
          </div>
        </div>
        
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
                  <Card key={`${color.year}-${index}`} className="overflow-hidden">
                    <div 
                      className="h-24 flex items-center justify-center"
                      style={{ backgroundColor: color.background }}
                    >
                      <h3 
                        className="text-2xl font-bold"
                        style={{ color: color.text }}
                      >
                        {team.nickname || team.name}
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium">{color.year}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Background</p>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-1" 
                              style={{ backgroundColor: color.background }}
                            />
                            <span className="font-mono">{color.background}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Text</p>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-1" 
                              style={{ backgroundColor: color.text }}
                            />
                            <span className="font-mono">{color.text}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
      </div>
    </PageLayout>
  );
};

export default TeamDetail;
