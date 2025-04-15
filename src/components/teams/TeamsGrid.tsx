
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TeamCard from './TeamCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

interface TeamsGridProps {
  teams: Team[];
  isLoading: boolean;
  showCreateButton?: boolean;
}

const TeamsGrid = ({ teams, isLoading, showCreateButton = true }: TeamsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (teams.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">No teams found</p>
        {showCreateButton && (
          <Button asChild>
            <Link to="/teams/create">Create a team</Link>
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {teams.map(team => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamsGrid;
