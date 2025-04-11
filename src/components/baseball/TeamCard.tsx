
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/lib/types/BaseballTypes';
import { getTeamColorsForYear } from '@/data/baseballTeamColors';

interface TeamCardProps {
  team: Team;
  year: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, year }) => {
  const colors = getTeamColorsForYear(team.id, year);
  
  if (!colors) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center p-4">
            <p>No color data available for {team.name} in {year}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-32 flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <h2 
          className="text-4xl font-bold tracking-tight"
          style={{ color: colors.text }}
        >
          {team.location} <span className="font-extrabold">{team.nickname}</span>
        </h2>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Full Name</h3>
            <p>{team.fullName || `${team.location} ${team.nickname}`}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Abbreviation</h3>
            <p>{team.abbreviation}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Established</h3>
            <p>{team.founded}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">League</h3>
            <p>{team.league}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Division</h3>
            <p>{team.division}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Selected Year</h3>
            <p>{year}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
