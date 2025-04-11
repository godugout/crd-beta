
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import useTeamsData from '@/hooks/useTeamsData';
import TeamsSearch from '@/components/teams/TeamsSearch';
import TeamsGrid from '@/components/teams/TeamsGrid';
import TeamsList from '@/components/teams/TeamsList';
import FeaturedTeams from '@/components/teams/FeaturedTeams';

const Teams: React.FC = () => {
  const { user } = useAuth();
  const { teams, isLoading, error, fetchTeams } = useTeamsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'my-teams' && user) {
      return matchesSearch && team.ownerId === user.id;
    }
    
    return matchesSearch;
  });
  
  const featuredTeams = teams.slice(0, 3);
  
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
        <FeaturedTeams teams={featuredTeams} />
      )}
      
      <TeamsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={fetchTeams}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Teams</TabsTrigger>
          {user && <TabsTrigger value="my-teams">My Teams</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="all">
          {activeView === 'grid' ? (
            <TeamsGrid teams={filteredTeams} isLoading={isLoading} showCreateButton={!!user} />
          ) : (
            <TeamsList teams={filteredTeams} isLoading={isLoading} />
          )}
        </TabsContent>
        
        {user && (
          <TabsContent value="my-teams">
            {activeView === 'grid' ? (
              <TeamsGrid teams={filteredTeams} isLoading={isLoading} showCreateButton />
            ) : (
              <TeamsList teams={filteredTeams} isLoading={isLoading} />
            )}
          </TabsContent>
        )}
      </Tabs>
    </Container>
  );
};

export default Teams;
