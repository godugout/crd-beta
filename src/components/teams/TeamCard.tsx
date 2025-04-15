
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    logo?: string;
    primaryColor: string;
    description: string;
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <Link to={`/teams/${team.id}`}>
      <div 
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white h-full"
      >
        <div 
          className="h-40 flex items-center justify-center" 
          style={{ 
            backgroundColor: `${team.primaryColor}10` // 10% opacity version of primary color
          }}
        >
          {team.logo ? (
            <img 
              src={team.logo} 
              alt={team.name} 
              className="h-24 w-24 object-contain"
            />
          ) : (
            <div 
              className="h-20 w-20 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: team.primaryColor }}
            >
              <Users className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 
            className="font-medium text-lg" 
            style={{ color: team.primaryColor }}
          >
            {team.name}
          </h3>
          <p className="text-gray-600 mt-1">{team.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
