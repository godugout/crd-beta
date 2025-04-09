import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, MapPin, Library, Pencil, Trophy, Settings } from 'lucide-react';
import TeamBreadcrumb from '@/components/navigation/components/TeamBreadcrumb';

interface TeamData {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  slug?: string;
  primaryColor?: string;
  city?: string;
  state?: string;
  founded_year?: number;
  stadium?: string;
  league?: string;
  division?: string;
}

const TeamDetail = () => {
  const { teamSlug } = useParams<{ teamSlug?: string }>();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamSlug) return;
      
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, description, owner_id, created_at, updated_at, logo_url')
          .eq('id', teamSlug)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching team details:', error);
          setLoading(false);
          return;
        }
        
        if (data) {
          const formattedTeam: TeamData = {
            id: data.id,
            name: data.name,
            description: data.description || undefined,
            owner_id: data.owner_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            logo_url: data.logo_url || undefined,
            slug: teamSlug,
            primaryColor: '#333333',
            city: undefined,
            state: undefined,
            founded_year: undefined,
            stadium: undefined,
            league: undefined,
            division: undefined
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
  
  const fallbackTeam: TeamData = {
    id: '1',
    name: teamSlug ? teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1) : 'Team',
    description: 'Team details are currently unavailable.',
    owner_id: 'system',
    primaryColor: '#333333',
    city: undefined,
    state: undefined,
    founded_year: undefined,
    stadium: undefined,
    league: undefined,
    division: undefined
  };
  
  const displayTeam = team || fallbackTeam;
  const headerBgColor = displayTeam.primaryColor || '#333';
  const textColor = getContrastColor(headerBgColor);
  
  return (
    <PageLayout 
      title={team?.name || teamSlug || 'Team'} 
      description={team?.description || `Information about this team`}
    >
      <TeamBreadcrumb />
      
      {!loading && (
        <>
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
                  <h1 className="text-4xl font-bold mb-2">{team?.name || teamSlug}</h1>
                  {team?.city && (
                    <p className="text-lg opacity-90">
                      {team.city}, {team.state}
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
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h2 className="text-xl font-semibold mb-4">About {team?.name || teamSlug}</h2>
                      <p className="text-gray-700 mb-4">
                        {team?.description || 'No team description available.'}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {team?.founded_year && (
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Founded</p>
                              <p className="font-medium">{team.founded_year}</p>
                            </div>
                          </div>
                        )}
                        
                        {team?.stadium && (
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Stadium</p>
                              <p className="font-medium">{team.stadium}</p>
                            </div>
                          </div>
                        )}
                        
                        {team?.league && (
                          <div className="flex items-center">
                            <Trophy className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">League</p>
                              <p className="font-medium">
                                {team.league}
                                {team.division && ` / ${team.division} Division`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
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
                          style={{ backgroundColor: displayTeam.primaryColor || undefined }}
                        >
                          <Link to={`/teams/${teamSlug}/memories/new`}>Share a Memory</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h2 className="text-lg font-medium mb-4">Team Actions</h2>
                      <div className="space-y-3">
                        <Button asChild className="w-full" 
                          style={{ backgroundColor: displayTeam.primaryColor || undefined }}
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
                    style={{ backgroundColor: displayTeam.primaryColor || undefined }}
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
                    style={{ backgroundColor: displayTeam.primaryColor || undefined }}
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
                    style={{ backgroundColor: displayTeam.primaryColor || undefined }}
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

const getContrastColor = (backgroundColor?: string): string => {
  if (!backgroundColor || backgroundColor.length < 7) {
    return '#ffffff';
  }
  
  const r = parseInt(backgroundColor.substring(1, 3), 16);
  const g = parseInt(backgroundColor.substring(3, 5), 16);
  const b = parseInt(backgroundColor.substring(5, 7), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default TeamDetail;
