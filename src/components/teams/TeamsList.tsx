
import React from 'react';
import TeamListItem from './TeamListItem';
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

interface TeamsListProps {
  teams: Team[];
  isLoading: boolean;
}

const TeamsList = ({ teams, isLoading }: TeamsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (teams.length === 0) {
    return null; // Empty state is handled by TeamsGrid
  }
  
  return (
    <div className="space-y-4">
      {teams.map(team => (
        <TeamListItem key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamsList;
