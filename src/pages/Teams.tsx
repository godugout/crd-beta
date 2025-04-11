
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Grid3X3, List, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  memberCount?: number;
  ownerId: string;
  createdAt: string;
  tags?: string[];
}

const Teams: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    fetchTeams();
  }, []);
  
  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(count)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const formattedTeams: Team[] = data.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description || '',
        logoUrl: team.logo_url || '',
        memberCount: team.team_members?.[0]?.count || 0,
        ownerId: team.owner_id,
        createdAt: team.created_at,
        tags: team.tags || [],
      }));
      
      setTeams(formattedTeams);
      if (formattedTeams.length > 0) {
        toast.success(`Loaded ${formattedTeams.length} teams`);
      }
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'Failed to fetch teams');
      toast.error('Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'my-teams' && user) {
      return matchesSearch && team.ownerId === user.id;
    }
    
    return matchesSearch;
  });
  
  const featuredTeams = teams.slice(0, 3);
  
  const renderTeamGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      );
    }
    
    if (filteredTeams.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No teams found</p>
          {user && (
            <Button asChild>
              <Link to="/teams/create">Create a team</Link>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTeams.map(team => (
          <Card key={team.id} className="overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {team.logoUrl ? (
                <img 
                  src={team.logoUrl} 
                  alt={team.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-16 w-16 text-gray-300" />
              )}
            </div>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {team.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Badge variant="outline">{team.memberCount} members</Badge>
              <Button asChild>
                <Link to={`/teams/${team.id}`}>View Team</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderTeamList = () => {
    if (isLoading || filteredTeams.length === 0) {
      return renderTeamGrid();
    }
    
    return (
      <div className="space-y-4">
        {filteredTeams.map(team => (
          <Card key={team.id}>
            <div className="flex items-center p-4">
              <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mr-4">
                {team.logoUrl ? (
                  <img 
                    src={team.logoUrl} 
                    alt={team.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{team.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {team.description || 'No description available'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{team.memberCount} members</Badge>
                <Button asChild>
                  <Link to={`/teams/${team.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        {user && (
          <Button asChild>
            <Link to="/teams/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Link>
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {featuredTeams.length > 0 && activeTab === 'all' && !searchTerm && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Featured Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTeams.map(team => (
              <Card key={team.id} className="overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {team.logoUrl ? (
                    <img 
                      src={team.logoUrl} 
                      alt={team.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/teams/${team.id}`}>View Team</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search teams" 
            className="flex-1"
          />
          <Button onClick={() => fetchTeams()}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md p-1">
            <Button
              variant={activeView === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveView('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={activeView === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveView('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Teams</TabsTrigger>
          {user && <TabsTrigger value="my-teams">My Teams</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="all">
          {activeView === 'grid' ? renderTeamGrid() : renderTeamList()}
        </TabsContent>
        
        {user && (
          <TabsContent value="my-teams">
            {activeView === 'grid' ? renderTeamGrid() : renderTeamList()}
          </TabsContent>
        )}
      </Tabs>
    </Container>
  );
};

export default Teams;
