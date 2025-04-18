
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Info, Calendar, Briefcase } from 'lucide-react';
import { TeamDisplayData } from '@/types/teams';

interface TeamGalleryCardProps {
  team: TeamDisplayData;
}

const TeamGalleryCard: React.FC<TeamGalleryCardProps> = ({ team }) => {
  // Helper function to determine if a color is light or dark
  const isLightColor = (color: string): boolean => {
    if (!color || color === '#') return true;
    
    // Convert hex to RGB
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Convert to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  // Use either primary_color from DB or fallback to color field
  const backgroundColor = team.primary_color || '#cccccc';
  const textColor = isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="h-24 flex items-center justify-center text-xl font-bold p-4" 
        style={{ 
          backgroundColor: backgroundColor,
          color: textColor,
          backgroundImage: team.secondary_color ? 
            `linear-gradient(135deg, ${backgroundColor} 60%, ${team.secondary_color})` : undefined
        }}
      >
        {team.name}
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{team.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>{team.memberCount?.toLocaleString() || 0} members</span>
          </div>
          
          {team.league && (
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{team.league}{team.division ? ` - ${team.division}` : ''}</span>
            </div>
          )}
          
          {team.founded_year && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Founded {team.founded_year}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline">
            <Link to={`/teams/${team.slug}/memories`}>View Memories</Link>
          </Button>
          <Button 
            asChild
            style={{ 
              backgroundColor: backgroundColor,
              color: textColor,
              border: 'none'
            }}
          >
            <Link to={`/teams/${team.slug}`}>Visit Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamGalleryCard;
