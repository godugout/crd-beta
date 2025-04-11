
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { teams, getTeamColorsForYear } from '@/data/baseballTeamColors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeamColorHistory from '@/components/baseball/TeamColorHistory';
import TeamCard from '@/components/baseball/TeamCard';

const BaseballArchive: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id || '');
  const [selectedYear, setSelectedYear] = useState(2000);
  const [activeTab, setActiveTab] = useState('teams');
  const navigate = useNavigate();
  
  const handleYearChange = (value: number[]) => {
    setSelectedYear(value[0]);
  };
  
  const team = teams.find(t => t.id === selectedTeam);
  const colorSet = team ? getTeamColorsForYear(selectedTeam, selectedYear) : null;
  
  const minYear = team?.colorHistory.reduce((min, color) => 
    color.year < min ? color.year : min, team.colorHistory[0]?.year || 1900) || 1900;
    
  const maxYear = new Date().getFullYear();
  
  const yearMarks = team?.colorHistory.map(color => color.year) || [];

  return (
    <PageLayout title="Baseball Archive" description="Historic baseball team data">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Baseball Archive</h1>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate('/baseball-archive/search')}>
              Advanced Search
            </Button>
            <Button variant="outline" onClick={() => navigate('/baseball-archive/stats')}>
              Statistics
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <Card className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Select a Team</h2>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.fullName || team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {team && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Year: {selectedYear}</h3>
                        <div className="px-2">
                          <Slider
                            value={[selectedYear]}
                            min={minYear}
                            max={maxYear}
                            step={1}
                            onValueChange={handleYearChange}
                          />
                          <div className="flex justify-between text-xs mt-1 text-gray-500">
                            <span>{minYear}</span>
                            <span>{maxYear}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedYear(prev => Math.max(prev - 1, minYear))}
                          disabled={selectedYear <= minYear}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">Year {selectedYear}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedYear(prev => Math.min(prev + 1, maxYear))}
                          disabled={selectedYear >= maxYear}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {team && colorSet && (
                  <Card className="p-4">
                    <h2 className="text-xl font-semibold mb-2">Selected Colors</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {team.fullName || team.name} - {selectedYear}
                    </p>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="relative h-20 w-full rounded-md overflow-hidden">
                        <div 
                          className="absolute inset-0" 
                          style={{ backgroundColor: colorSet.background }}
                        />
                        <div 
                          className="absolute inset-0 flex items-center justify-center font-bold text-xl"
                          style={{ color: colorSet.text }}
                        >
                          {team.name}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Background</p>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: colorSet.background }}
                            />
                            <span className="text-sm font-mono">{colorSet.background}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Text</p>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: colorSet.text }}
                            />
                            <span className="text-sm font-mono">{colorSet.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate(`/baseball-archive/team/${selectedTeam}`)}
                >
                  View Full Team Details
                </Button>
              </div>
              
              <div className="md:col-span-2">
                {team && colorSet ? (
                  <div className="space-y-6">
                    <TeamCard team={team} year={selectedYear} />
                    <TeamColorHistory team={team} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Select a team to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="players">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Player database coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="seasons">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Seasons & games database coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BaseballArchive;
