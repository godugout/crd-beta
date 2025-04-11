
import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
}

interface FeaturedTeamsProps {
  teams: Team[];
}

const FeaturedTeams = ({ teams }: FeaturedTeamsProps) => {
  if (!teams.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Featured Teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map(team => (
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
  );
};

export default FeaturedTeams;
