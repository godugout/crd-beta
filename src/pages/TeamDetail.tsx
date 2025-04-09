
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/lib/types/TeamTypes';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TeamBreadcrumb from '@/components/navigation/components/TeamBreadcrumb';
import TeamAdminSection from '@/components/TeamAdminSection';
import { teamRepository } from '@/lib/data/teamRepository';
import { useAuth } from '@/context/auth/useAuth';
import { Users, Calendar, MapPin, Trophy, Info } from 'lucide-react';
import { TeamMember } from '@/lib/types';

const TeamDetail = () => {
  const { teamSlug } = useParams<{ teamSlug: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamSlug) return;
      
      setIsLoading(true);
      
      try {
        // Fetch full team details
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('team_code', teamSlug.toUpperCase())
          .single();
          
        if (error) {
          console.error('Error fetching team details:', error);
          setTeam(null);
        } else if (data) {
          // Transform to Team type
          const teamData: Team = {
            id: data.id,
            name: data.name,
            description: data.description || '',
            owner_id: data.owner_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            logo_url: data.logo_url || undefined,
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
            is_active: data.is_active || undefined,
            slug: teamSlug
          };
          
          setTeam(teamData);
          
          // Check if the current user is the team owner
          if (user && user.id === data.owner_id) {
            setIsOwner(true);
          }
          
          // Fetch team members
          if (teamData.id) {
            const { data: members, error: membersError } = await teamRepository.getTeamMembers(teamData.id);
            
            if (membersError) {
              console.error('Error fetching team members:', membersError);
              setTeamMembers([]);
            } else if (members) {
              setTeamMembers(members);
            }
          }
        }
      } catch (err) {
        console.error('Error in team details:', err);
        setTeam(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [teamSlug, user]);
  
  // Styling based on team colors
  const headerStyle = team?.primary_color ? {
    backgroundColor: team.primary_color,
    color: isLightColor(team.primary_color) ? '#000000' : '#FFFFFF',
    backgroundImage: team.secondary_color ? 
      `linear-gradient(135deg, ${team.primary_color} 60%, ${team.secondary_color})` : undefined
  } : {};
  
  if (isLoading) {
    return (
      <PageLayout title="Team Details" description="Loading team details...">
        <TeamBreadcrumb />
        <div className="container mx-auto p-8 flex justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-4xl">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-12 w-64 bg-gray-200 rounded-md"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!team) {
    return (
      <PageLayout title="Team Not Found" description="The requested team could not be found">
        <TeamBreadcrumb />
        <div className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Team Not Found</h2>
          <p>Sorry, we couldn't find a team with the slug "{teamSlug}".</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout 
      title={`${team.name} Team Page`} 
      description={team.description || `Official team page for ${team.name}`}
    >
      <TeamBreadcrumb />
      
      {/* Team Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8" style={headerStyle}>
        <div className="container mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{team.name}</h1>
          <p className="text-lg opacity-90">{team.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            {team.founded_year && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Est. {team.founded_year}</span>
              </div>
            )}
            
            {team.city && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{team.city}, {team.state}</span>
              </div>
            )}
            
            {team.league && (
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                <span>{team.league} {team.division && `- ${team.division}`}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{teamMembers.length} Team Members</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="memories">Memories</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isOwner && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About {team.name}</h2>
                    <p className="text-gray-700">{team.description || 'No team description available.'}</p>
                    
                    {team.stadium && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Home Stadium</h3>
                        <div className="flex items-center">
                          <Info className="h-5 w-5 mr-2 text-gray-500" /> 
                          {team.stadium}
                        </div>
                      </div>
                    )}
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-2">Team Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {team.mascot && (
                        <div>
                          <span className="text-sm text-gray-500">Mascot</span>
                          <p>{team.mascot}</p>
                        </div>
                      )}
                      
                      {team.league && (
                        <div>
                          <span className="text-sm text-gray-500">League</span>
                          <p>{team.league}</p>
                        </div>
                      )}
                      
                      {team.division && (
                        <div>
                          <span className="text-sm text-gray-500">Division</span>
                          <p>{team.division}</p>
                        </div>
                      )}
                      
                      {team.founded_year && (
                        <div>
                          <span className="text-sm text-gray-500">Founded</span>
                          <p>{team.founded_year}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Team Colors</h3>
                    
                    {team.primary_color && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Primary Color</span>
                        <div 
                          className="h-12 rounded mt-1 flex items-center justify-center font-medium" 
                          style={{ 
                            backgroundColor: team.primary_color,
                            color: isLightColor(team.primary_color) ? '#000000' : '#FFFFFF'
                          }}
                        >
                          {team.primary_color}
                        </div>
                      </div>
                    )}
                    
                    {team.secondary_color && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Secondary Color</span>
                        <div 
                          className="h-12 rounded mt-1 flex items-center justify-center font-medium" 
                          style={{ 
                            backgroundColor: team.secondary_color,
                            color: isLightColor(team.secondary_color) ? '#000000' : '#FFFFFF'
                          }}
                        >
                          {team.secondary_color}
                        </div>
                      </div>
                    )}
                    
                    {team.tertiary_color && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Tertiary Color</span>
                        <div 
                          className="h-12 rounded mt-1 flex items-center justify-center font-medium" 
                          style={{ 
                            backgroundColor: team.tertiary_color,
                            color: isLightColor(team.tertiary_color) ? '#000000' : '#FFFFFF'
                          }}
                        >
                          {team.tertiary_color}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="memories">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Memories tab content will go here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Team Members</h2>
              
              {teamMembers.length === 0 ? (
                <p className="text-gray-500">No team members found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map(member => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                          {member.user?.avatarUrl ? (
                            <img 
                              src={member.user.avatarUrl} 
                              alt={member.user.displayName || 'Team Member'} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                              {(member.user?.displayName || 'TM').charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{member.user?.displayName || 'Team Member'}</h3>
                          <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {isOwner && (
            <TabsContent value="admin">
              <TeamAdminSection 
                teamId={team.id}
                teamSlug={teamSlug}
                teamName={team.name}
                isOwner={isOwner}
                memberCount={teamMembers.length}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageLayout>
  );
};

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Handle empty or invalid colors
  if (!color || color === '#') return true;
  
  // Convert hex to RGB
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Convert to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export default TeamDetail;
