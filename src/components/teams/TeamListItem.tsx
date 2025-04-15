
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface TeamListItemProps {
  team: {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    memberCount?: number;
  };
}

const TeamListItem = ({ team }: TeamListItemProps) => {
  return (
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
  );
};

export default TeamListItem;
