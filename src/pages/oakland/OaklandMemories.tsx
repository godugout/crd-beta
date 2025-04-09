
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/navigation/PageLayout';
import TeamBreadcrumb from '@/components/navigation/components/TeamBreadcrumb';
import { teamOperations } from '@/lib/supabase';

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
        if (teamOperations.getTeamBySlug) {
          // Use the teamOperations utility if available
          const { data, error } = await teamOperations.getTeamBySlug(teamSlug);
          
          if (error) {
            console.error('Error fetching team info:', error);
            // Set default values if team is not found
            setTeamInfo({
              name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
              primary_color: '#006341',
              secondary_color: '#EFB21E'
            });
            return;
          }
          
          if (data) {
            setTeamInfo({
              name: data.name,
              primary_color: data.primary_color,
              secondary_color: data.secondary_color
            });
            return;
          }
        }
        
        // Fallback direct query
        const { data, error } = await supabase
          .from('teams')
          .select('name, primary_color, secondary_color')
          .eq('team_code', teamSlug.toUpperCase())
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching team info:', error);
          // Set default values if team is not found
          setTeamInfo({
            name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
            primary_color: '#006341',
            secondary_color: '#EFB21E'
          });
          return;
        }
          
        if (data) {
          setTeamInfo({
            name: data.name,
            primary_color: data.primary_color || undefined,
            secondary_color: data.secondary_color || undefined
          });
        } else {
          // Set default values if team is not found
          setTeamInfo({
            name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
            primary_color: '#006341',
            secondary_color: '#EFB21E'
          });
        }
      } catch (err) {
        console.error('Error fetching team info:', err);
        // Set default values on error
        setTeamInfo({
          name: teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1),
          primary_color: '#006341',
          secondary_color: '#EFB21E'
        });
      }
    };
    
    fetchTeamInfo();
  }, [teamSlug]);
  
  return (
    <PageLayout 
      title={teamInfo.name ? `${teamInfo.name} Memories` : 'Team Memories'}
      description={teamInfo.name ? `Browse memories for ${teamInfo.name} fans` : 'Browse team memories'}
    >
      <TeamBreadcrumb currentPage="Memories" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{teamInfo.name || 'Team'} Memories</h1>
        
        <div style={{ 
          backgroundColor: teamInfo.primary_color || '#ccc',
          color: teamInfo.secondary_color || '#000',
          padding: '2rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <p className="text-lg">
            Browse and explore memories from {teamInfo.name || 'this team'}'s rich history.
          </p>
        </div>
        
        {/* Memory content will go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">First Memory</h3>
            <p className="text-gray-600">This is where memories will be displayed.</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Second Memory</h3>
            <p className="text-gray-600">Each memory card will show details and images.</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Third Memory</h3>
            <p className="text-gray-600">Clicking on a memory will take you to its details.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default OaklandMemories;
