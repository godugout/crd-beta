
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TeamInfo {
  name?: string;
  primary_color?: string;
  secondary_color?: string;
}

function OaklandMemories() {
  const { teamSlug } = useParams<{ teamSlug?: string }>();
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({});
  
  // If we have a team slug, fetch the team's details
  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!teamSlug) return;
      
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('name, primary_color, secondary_color')
          .eq('team_code', teamSlug.toUpperCase())
          .single();
          
        if (error) {
          console.error('Error fetching team info:', error);
          return;
        }
          
        if (data) {
          setTeamInfo({
            name: data.name,
            primary_color: data.primary_color || undefined,
            secondary_color: data.secondary_color || undefined
          });
        }
      } catch (err) {
        console.error('Error fetching team info:', err);
      }
    };
    
    fetchTeamInfo();
  }, [teamSlug]);
  
  return (
    <div>
      <h1>Oakland Memories Page</h1>
      {teamInfo.name && (
        <div>
          <p>Team: {teamInfo.name}</p>
          <div style={{ 
            backgroundColor: teamInfo.primary_color || '#ccc',
            color: teamInfo.secondary_color || '#000'
          }}>
            Team Colors Sample
          </div>
        </div>
      )}
    </div>
  );
}

export default OaklandMemories;
