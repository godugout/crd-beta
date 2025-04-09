
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamBreadcrumbProps {
  currentPage?: string;
}

interface TeamInfo {
  name: string;
  color?: string;
}

const TeamBreadcrumb: React.FC<TeamBreadcrumbProps> = ({ currentPage }) => {
  const { teamSlug } = useParams<{ teamSlug?: string }>();
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({ name: '' });
  
  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!teamSlug) return;
      
      try {
        // Get team information from the database
        const { data, error } = await supabase
          .from('teams')
          .select('name')
          .eq('id', teamSlug)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching team for breadcrumb:', error);
          // Use fallback when there's an error
          setTeamInfo({
            name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
            color: undefined
          });
          return;
        }
          
        if (data) {
          // If we have valid data, use it
          setTeamInfo({
            name: data.name || teamSlug,
            color: undefined
          });
        } else {
          // Fallback to using the slug if no data found
          setTeamInfo({
            name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
            color: undefined
          });
        }
      } catch (err) {
        console.error('Error in team breadcrumb:', err);
        setTeamInfo({
          name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
          color: undefined
        });
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
