
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import OaklandMemoryGallery from '@/components/oakland/OaklandMemoryGallery';
import MetaTags from '@/components/shared/MetaTags';
import TeamBreadcrumb from '@/components/navigation/components/TeamBreadcrumb';
import { supabase } from '@/integrations/supabase/client';

const OaklandMemories: React.FC = () => {
  const [teamData, setTeamData] = useState<{
    primaryColor: string;
    secondaryColor?: string;
  }>({
    primaryColor: '#006341',
  });
  
  useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('primary_color, secondary_color')
          .eq('team_code', 'OAK')
          .single();
          
        if (error) {
          console.error('Error fetching team colors:', error);
          return;
        }
        
        if (data) {
          setTeamData({
            primaryColor: data.primary_color || '#006341',
            secondaryColor: data.secondary_color || '#EFB21E',
          });
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
    fetchTeamColors();
  }, []);
  
  return (
    <>
      <MetaTags 
        title="Oakland A's Memories"
        description="Explore fan memories and experiences from Oakland Athletics baseball games."
        canonicalPath="/teams/oakland/memories"
      />
      
      <TeamBreadcrumb currentPage="Memories" />
      
      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-24">
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: teamData.primaryColor }}>Oakland A's Memories</h1>
              <p className="text-gray-600">
                Preserve your Oakland Athletics baseball memories from 1968 to today
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild style={{ backgroundColor: teamData.primaryColor, color: '#fff' }}>
                <Link to="/teams/oakland/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Memory
                </Link>
              </Button>
              
              <Button asChild variant="outline" style={{ borderColor: teamData.primaryColor, color: teamData.primaryColor }}>
                <Link to="/group-memory-creator">
                  <Users className="h-4 w-4 mr-2" />
                  Group Memory
                </Link>
              </Button>
            </div>
          </div>
          
          <OaklandMemoryGallery />
        </div>
      </div>
    </>
  );
};

export default OaklandMemories;
