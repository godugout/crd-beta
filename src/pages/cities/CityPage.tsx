
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_TEAMS } from '@/lib/config/teamConfigs';

const CityPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();

  // Mock city data - replace with actual API call
  const cityTeams = SAMPLE_TEAMS.filter(team => {
    if (citySlug === 'oakland') return team.slug?.includes('oakland');
    if (citySlug === 'san-francisco') return team.slug?.includes('san-francisco');
    return false;
  });

  const cityName = citySlug === 'oakland' ? 'Oakland' : 
                   citySlug === 'san-francisco' ? 'San Francisco' : 'Unknown City';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            {cityName} Teams
          </h1>
          <p className="text-xl text-gray-300">
            Choose your team to explore fan memories and community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cityTeams.map((team) => (
            <Card 
              key={team.id} 
              className="hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate(`/teams/${team.slug}`)}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <CardDescription>
                  {team.league} • {team.division}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{team.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Founded {team.founded_year}</span>
                  <span>{team.stadium}</span>
                </div>
                <Button className="w-full mt-4">
                  Enter Fan Zone
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {cityTeams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏟️</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No teams found for {cityName}
            </h3>
            <p className="text-gray-400 mb-8">
              We're working on adding more teams to this city.
            </p>
            <Button onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityPage;
