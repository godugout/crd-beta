
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DbTeam } from '@/lib/types/TeamTypes';

interface TeamBreadcrumbProps {
  currentPage?: string;
}

const TeamBreadcrumb: React.FC<TeamBreadcrumbProps> = ({ currentPage }) => {
  const { teamSlug } = useParams<{ teamSlug?: string }>();
  const [teamInfo, setTeamInfo] = useState<{ name: string; color?: string }>({ name: '' });
  
  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!teamSlug) return;
      
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('name, primary_color')
          .eq('team_code', teamSlug.toUpperCase())
          .single();
          
        if (error) {
          console.error('Error fetching team for breadcrumb:', error);
          return;
        }
          
        if (data) {
          setTeamInfo({
            name: data.name,
            color: data.primary_color || undefined
          });
        }
      } catch (err) {
        console.error('Error in team breadcrumb:', err);
      }
    };
    
    fetchTeamInfo();
  }, [teamSlug]);
  
  if (!teamSlug) return null;
  
  return (
    <nav className="flex items-center text-sm py-3 px-4 bg-gray-50">
      <Link to="/" className="text-gray-500 hover:text-gray-700">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      
      <Link to="/teams" className="text-gray-500 hover:text-gray-700 flex items-center">
        <Users className="w-4 h-4 mr-1" />
        <span>Teams</span>
      </Link>
      
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      
      <Link 
        to={`/teams/${teamSlug}`} 
        className="hover:underline flex items-center"
        style={{ color: teamInfo.color || '#333' }}
      >
        <span className="font-medium">{teamInfo.name || teamSlug}</span>
      </Link>
      
      {currentPage && (
        <>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-700">{currentPage}</span>
        </>
      )}
    </nav>
  );
};

export default TeamBreadcrumb;
