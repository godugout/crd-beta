
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    memberCount?: number;
    tags?: string[];
  };
}

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Card key={team.id} className="overflow-hidden h-full">
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
  );
};

export default TeamCard;
