
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import MemoryPacksSection from '@/components/card-showcase/MemoryPacksSection';
import { supabase } from '@/integrations/supabase/client';

interface TeamInfo {
  primary_color?: string;
  name?: string;
}

const MemoryPacks = () => {
  const { collections, isLoading } = useCards();
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
          
        if (!error && data) {
          setTeamInfo({
            primary_color: data.primary_color,
            name: data.name
          });
        }
      } catch (err) {
        console.error('Error fetching team info:', err);
      }
    };
    
    fetchTeamInfo();
  }, [teamSlug]);
  
  const handleViewPack = (packId: string) => {
    // This is handled by the Link component in MemoryPacksSection
    // but kept here in case we need additional logic in the future
  };
  
  const pageTitle = teamInfo.name ? `${teamInfo.name} Memory Packs` : "Memory Packs";
  const pageDescription = teamInfo.name 
    ? `Browse and collect themed memory packs for ${teamInfo.name} fans`
    : "Browse and collect themed memory packs";
    
  const buttonStyle = teamInfo.primary_color 
    ? { 
        backgroundColor: teamInfo.primary_color, 
        color: getContrastColor(teamInfo.primary_color),
        border: 'none'
      } 
    : {};
  
  return (
    <PageLayout 
      title={pageTitle} 
      description={pageDescription}
      canonicalPath={teamSlug ? `/teams/${teamSlug}/packs` : "/packs"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-gray-600 mt-2">{pageDescription}</p>
          </div>
          <Button asChild style={buttonStyle}>
            <Link to={teamSlug ? `/teams/${teamSlug}/packs/create` : "/packs/create"}>
              <Plus className="mr-2 h-4 w-4" /> Create Pack
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading memory packs...</div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium">No memory packs yet</h2>
            <p className="mt-2 text-gray-500">Create your first memory pack to get started</p>
            <Button asChild className="mt-4" style={buttonStyle}>
              <Link to={teamSlug ? `/teams/${teamSlug}/packs/create` : "/packs/create"}>Create Memory Pack</Link>
            </Button>
          </div>
        ) : (
          <MemoryPacksSection 
            isLoading={isLoading} 
            packs={collections} 
            handleViewPack={handleViewPack} 
            teamColor={teamInfo.primary_color}
          />
        )}
      </div>
    </PageLayout>
  );
};

// Helper function to determine contrast color (white or black) for a given background color
const getContrastColor = (hexColor?: string): string => {
  if (!hexColor || hexColor.length < 7) return '#ffffff';
  
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default MemoryPacks;
