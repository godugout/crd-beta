
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamNavigationProps {
  showLabel?: boolean;
}

interface Team {
  id: string;
  name: string;
  primary_color?: string;
}

const TeamNavigation: React.FC<TeamNavigationProps> = ({ showLabel = true }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('teams')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching teams:', error);
          return;
        }
        
        if (data) {
          // Use a default primary_color since the column doesn't exist
          const teamsWithColor = data.map(team => ({
            ...team,
            primary_color: '#888'
          }));
          setTeams(teamsWithColor);
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2">
        <Users size={18} className="text-gray-500" />
        {showLabel && <span className="text-gray-500">Loading teams...</span>}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Link to="/teams" className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md">
        <Users size={18} />
        {showLabel && <span>All Teams</span>}
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <Link to="/teams" className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md">
        <Users size={18} />
        {showLabel && <span>All Teams</span>}
      </Link>
      
      {teams.map(team => (
        <Link 
          key={team.id}
          to={`/teams/${team.id}`}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md ml-4"
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: team.primary_color || '#888' }}
          />
          {showLabel && <span>{team.name}</span>}
        </Link>
      ))}
    </div>
  );
};

export default TeamNavigation;
