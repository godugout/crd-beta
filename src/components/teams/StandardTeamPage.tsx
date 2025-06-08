
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Calendar, Trophy } from 'lucide-react';
import { Team } from '@/lib/types/teamTypes';
import { useTeam } from '@/lib/hooks/useTeam';

interface StandardTeamPageProps {
  team: Team;
}

const StandardTeamPage: React.FC<StandardTeamPageProps> = ({ team }) => {
  const navigate = useNavigate();
  const { hasFeature } = useTeam(team.slug);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--team-primary)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--team-secondary)' }}>
            {team.name}
          </h1>
          <p className="text-xl mb-8 text-white/90">
            {team.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 rounded-full bg-white/20 text-white">
              {team.league} • {team.division}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/20 text-white">
              Founded {team.founded_year}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/20 text-white">
              {team.stadium}
            </span>
          </div>
          
          {hasFeature('memories') && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate(`/teams/${team.slug}/create`)}
                size="lg"
                className="bg-white text-current hover:bg-white/90"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share a Memory
              </Button>
              <Button
                onClick={() => navigate(`/teams/${team.slug}/memories`)}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-current"
              >
                View Memories
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hasFeature('memories') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Fan Memories
                </CardTitle>
                <CardDescription>
                  Share and explore memories from fellow fans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(`/teams/${team.slug}/memories`)}
                  className="w-full"
                >
                  Explore Memories
                </Button>
              </CardContent>
            </Card>
          )}

          {hasFeature('community') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Community Events
                </CardTitle>
                <CardDescription>
                  Connect with other fans at games and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(`/teams/${team.slug}/events`)}
                  className="w-full"
                >
                  View Events
                </Button>
              </CardContent>
            </Card>
          )}

          {hasFeature('templates') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Memory Templates
                </CardTitle>
                <CardDescription>
                  Create beautiful memories with team-themed templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(`/teams/${team.slug}/templates`)}
                  className="w-full"
                >
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardTeamPage;
