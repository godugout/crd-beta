
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/lib/types/TeamTypes';
import { Users, Calendar, MapPin, Library, Pencil, Trophy, Settings } from 'lucide-react';
import TeamBreadcrumb from '@/components/navigation/components/TeamBreadcrumb';
import { teamOperations } from '@/lib/supabase';

const TeamDetail = () => {
  const { teamSlug } = useParams<{ teamSlug?: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamSlug) return;
      
      try {
        // First try to use the teamOperations utility
        if (teamOperations.getTeamBySlug) {
          const { data, error } = await teamOperations.getTeamBySlug(teamSlug);
          
          if (!error && data) {
            setTeam(data);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to direct query
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('team_code', teamSlug.toUpperCase())
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching team details:', error);
          setLoading(false);
          return;
        }
        
        if (data) {
          // Map the data to our Team interface
          const formattedTeam: Team = {
            id: data.id,
            name: data.name,
            description: data.description || undefined,
            owner_id: data.owner_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            logo_url: data.logo_url || undefined,
            slug: teamSlug,
            team_code: data.team_code || undefined,
            primary_color: data.primary_color || undefined,
            secondary_color: data.secondary_color || undefined,
            tertiary_color: data.tertiary_color || undefined,
            founded_year: data.founded_year || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            country: data.country || undefined,
            stadium: data.stadium || undefined,
            mascot: data.mascot || undefined,
            league: data.league || undefined,
            division: data.division || undefined,
            is_active: data.is_active || false
          };
          
          setTeam(formattedTeam);
        }
      } catch (err) {
        console.error('Error in team details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamDetails();
  }, [teamSlug]);
  
  // Fallback for when team data is not available
  const fallbackTeam: Team = {
    id: '1',
    name: teamSlug ? teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1) : 'Team',
    description: 'Team details are currently unavailable.',
    owner_id: 'system',
    primary_color: '#333333'
  };
  
  const displayTeam = team || fallbackTeam;
  const headerBgColor = displayTeam.primary_color || '#333';
  const textColor = getContrastColor(headerBgColor);
  
  return (
    <PageLayout 
      title={displayTeam.name} 
      description={displayTeam.description || `Information about ${displayTeam.name}`}
    >
      <TeamBreadcrumb />
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Team Header */}
          <div 
            className="py-12" 
            style={{ 
              backgroundColor: headerBgColor,
              color: textColor
            }}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{displayTeam.name}</h1>
                  {displayTeam.city && (
                    <p className="text-lg opacity-90">
                      {displayTeam.city}, {displayTeam.state}
                    </p>
                  )}
                </div>
                
                <div className="space-x-3">
                  <Button variant="outline" asChild
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: textColor,
                      color: textColor
                    }}
                  >
                    <Link to={`/teams/${teamSlug}/edit`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Content */}
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="memories">Memories</TabsTrigger>
                <TabsTrigger value="packs">Memory Packs</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column - Team Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h2 className="text-xl font-semibold mb-4">About {displayTeam.name}</h2>
                      <p className="text-gray-700 mb-4">
                        {displayTeam.description || 'No team description available.'}
                      </p>
                      
                      {/* Team Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {displayTeam.founded_year && (
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Founded</p>
                              <p className="font-medium">{displayTeam.founded_year}</p>
                            </div>
                          </div>
                        )}
                        
                        {displayTeam.stadium && (
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Stadium</p>
                              <p className="font-medium">{displayTeam.stadium}</p>
                            </div>
                          </div>
                        )}
                        
                        {displayTeam.league && (
                          <div className="flex items-center">
                            <Trophy className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">League</p>
                              <p className="font-medium">
                                {displayTeam.league}
                                {displayTeam.division && ` / ${displayTeam.division} Division`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Recent Memories */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Memories</h2>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/teams/${teamSlug}/memories`}>View All</Link>
                        </Button>
                      </div>
                      
                      <div className="text-center py-8 text-gray-500">
                        <Library className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No memories have been shared yet.</p>
                        <Button asChild className="mt-4" 
                          style={{ backgroundColor: displayTeam.primary_color || undefined }}
                        >
                          <Link to={`/teams/${teamSlug}/memories/new`}>Share a Memory</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Team Stats & Actions */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h2 className="text-lg font-medium mb-4">Team Actions</h2>
                      <div className="space-y-3">
                        <Button asChild className="w-full" 
                          style={{ backgroundColor: displayTeam.primary_color || undefined }}
                        >
                          <Link to={`/teams/${teamSlug}/memories/new`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Create Memory
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/teams/${teamSlug}/packs/new`}>
                            Create Memory Pack
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h2 className="text-lg font-medium mb-4">Team Members</h2>
                      <div className="flex items-center mb-4">
                        <Users className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Total Members</p>
                          <p className="font-medium">0 members</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/teams/${teamSlug}/members`}>View Members</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="memories">
                <div className="text-center py-12">
                  <Library className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-xl font-medium mb-2">No Memories Yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to share a memory with this team</p>
                  <Button asChild 
                    style={{ backgroundColor: displayTeam.primary_color || undefined }}
                  >
                    <Link to={`/teams/${teamSlug}/memories/new`}>Share a Memory</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="packs">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Memory Packs</h3>
                  <p className="text-gray-500 mb-6">No memory packs available for this team yet</p>
                  <Button asChild 
                    style={{ backgroundColor: displayTeam.primary_color || undefined }}
                  >
                    <Link to={`/teams/${teamSlug}/packs/create`}>Create Memory Pack</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="members">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-xl font-medium mb-2">Team Members</h3>
                  <p className="text-gray-500 mb-6">This team doesn't have any members yet</p>
                  <Button asChild 
                    style={{ backgroundColor: displayTeam.primary_color || undefined }}
                  >
                    <Link to={`/teams/${teamSlug}/invite`}>Invite Members</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </PageLayout>
  );
};

// Helper function to determine appropriate contrast color
const getContrastColor = (backgroundColor?: string): string => {
  if (!backgroundColor || backgroundColor.length < 7) {
    return '#ffffff';
  }
  
  // Convert hex to RGB
  const r = parseInt(backgroundColor.substring(1, 3), 16);
  const g = parseInt(backgroundColor.substring(3, 5), 16);
  const b = parseInt(backgroundColor.substring(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default TeamDetail;
