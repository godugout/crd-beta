
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Team } from '@/lib/types/BaseballTypes';

interface TeamHeaderSectionProps {
  team: Team;
  currentColors: { background: string; text: string } | null;
}

const TeamHeaderSection: React.FC<TeamHeaderSectionProps> = ({ team, currentColors }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button variant="outline" onClick={() => navigate('/baseball-archive')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Archive
      </Button>
      
      <div className="mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{team.fullName || team.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Founded {team.founded}</span>
            </div>
          </div>
          
          {currentColors && (
            <div className="flex items-center mt-4 md:mt-0 gap-3">
              <div className="flex items-center">
                <div 
                  className="w-5 h-5 rounded mr-2" 
                  style={{ backgroundColor: currentColors.background }}
                />
                <span className="text-sm font-mono">{currentColors.background}</span>
              </div>
              <div className="flex items-center">
                <div 
                  className="w-5 h-5 rounded mr-2" 
                  style={{ backgroundColor: currentColors.text }}
                />
                <span className="text-sm font-mono">{currentColors.text}</span>
              </div>
            </div>
          )}
        </div>
        
        <div 
          className="h-48 mt-6 rounded-lg flex items-center justify-center"
          style={currentColors ? { 
            backgroundColor: currentColors.background
          } : undefined}
        >
          <h2 
            className="text-6xl font-bold tracking-tight"
            style={currentColors ? { color: currentColors.text } : undefined}
          >
            {team.nickname || team.name}
          </h2>
        </div>
      </div>
    </>
  );
};

export default TeamHeaderSection;
