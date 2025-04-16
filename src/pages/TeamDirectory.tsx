
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { teams, getTeamColorsForYear } from '@/data/baseballTeamColors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users } from 'lucide-react';

const TeamDirectory = () => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState('teams');
  const navigate = useNavigate();
  
  const team = teams.find(t => t.id === selectedTeam);
  const colorSet = team ? getTeamColorsForYear(selectedTeam, selectedYear) : null;
  
  const featuredTeams = [
    {
      id: 'oakland',
      name: 'Oakland Athletics',
      description: 'Home of the As',
      path: '/teams/oakland'
    },
    {
      id: 'sf-giants',
      name: 'San Francisco Giants',
      description: 'Home of the Giants',
      path: '/teams/sf-giants'
    }
  ];

  return (
    <PageLayout title="Teams & Towns Directory">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="teams" className="w-full space-y-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="towns">Towns</TabsTrigger>
            <TabsTrigger value="fans">Fans</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Featured Teams</h3>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {featuredTeams.map((team) => (
                    <Button
                      key={team.id}
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate(team.path)}
                    >
                      <div>
                        <div className="font-semibold">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Team Colors Explorer</h3>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {colorSet && (
                    <div className="space-y-4">
                      <div className="h-24 rounded-lg overflow-hidden">
                        <div 
                          className="h-full w-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: colorSet.background,
                            color: colorSet.text
                          }}
                        >
                          <span className="text-2xl font-bold">{team?.name}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Primary:</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: colorSet.background }}
                            />
                            {colorSet.background}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Text:</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: colorSet.text }}
                            />
                            {colorSet.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="towns">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Towns Directory</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredTeams.map((team) => (
                    <Button
                      key={team.id}
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate(`/towns/${team.id}`)}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-semibold">{team.name.split(' ')[0]}</div>
                        <div className="text-sm text-muted-foreground">Explore the city</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fans">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Fans Directory</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon! Connect with other fans in your area.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default TeamDirectory;
