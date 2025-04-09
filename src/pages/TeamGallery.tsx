
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Users, Filter, Info, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/lib/types/TeamTypes';
import { Database } from '@/integrations/supabase/types';

type TeamRow = Database['public']['Tables']['teams']['Row'];

const TeamGallery = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLeague, setActiveLeague] = useState<string>('all');
  const [activeDivision, setActiveDivision] = useState<string>('all');

  // Fetch teams from Supabase
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      
      try {
        // Build query based on filters
        let query = supabase.from('teams').select('*');
        
        if (activeLeague !== 'all') {
          query = query.eq('league', activeLeague);
        }
        
        if (activeDivision !== 'all') {
          query = query.eq('division', activeDivision);
        }
        
        // Always include active teams
        query = query.eq('is_active', true);
        
        const { data, error } = await query.order('name');
        
        if (error) {
          console.error('Error fetching teams:', error);
        } else if (data) {
          // Transform the data to match our interface
          const transformedTeams: Team[] = data.map((team: any) => ({
            id: team.id,
            name: team.name,
            slug: team.team_code ? team.team_code.toLowerCase() : team.name.toLowerCase().replace(/\s+/g, '-'),
            description: team.description || '',
            color: team.primary_color || '#cccccc',
            memberCount: Math.floor(Math.random() * 1500) + 500, // Placeholder member count
            primary_color: team.primary_color,
            secondary_color: team.secondary_color,
            tertiary_color: team.tertiary_color,
            founded_year: team.founded_year,
            city: team.city,
            state: team.state,
            country: team.country,
            stadium: team.stadium,
            league: team.league,
            division: team.division,
            team_code: team.team_code
          }));
          setTeams(transformedTeams);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [activeLeague, activeDivision]);

  // If we don't have team data yet, use the hardcoded data as a fallback
  const fallbackTeams: Team[] = [
    { 
      id: '1', 
      name: 'Oakland A\'s', 
      slug: 'oakland', 
      description: 'Memories and cards for Oakland Athletics fans',
      color: '#006341',
      memberCount: 1243
    },
    { 
      id: '2', 
      name: 'San Francisco Giants', 
      slug: 'sf-giants', 
      description: 'A community for SF Giants fans to share their memories',
      color: '#FD5A1E',
      memberCount: 984
    },
    { 
      id: '3', 
      name: 'Los Angeles Dodgers', 
      slug: 'la-dodgers', 
      description: 'Dodgers memories and moments from fans',
      color: '#005A9C',
      memberCount: 756
    }
  ];

  const displayTeams = teams.length > 0 ? teams : fallbackTeams;
  
  const leagues = ['all', 'American League', 'National League'];
  const divisions = ['all', 'East', 'Central', 'West'];

  return (
    <PageLayout title="Teams" description="Browse team memories and collections">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Baseball Teams</h1>
            <p className="text-gray-600 mt-2">Browse team memories and collections</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter:</span>
          </div>
          
          <div className="space-x-2">
            {leagues.map(league => (
              <Button 
                key={league}
                variant={activeLeague === league ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveLeague(league)}
              >
                {league === 'all' ? 'All Leagues' : league}
              </Button>
            ))}
          </div>
          
          {activeLeague !== 'all' && (
            <div className="space-x-2">
              {divisions.map(division => (
                <Button 
                  key={division}
                  variant={activeDivision === division ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveDivision(division)}
                >
                  {division === 'all' ? 'All Divisions' : division}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-600">Loading teams...</p>
          </div>
        )}
        
        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && displayTeams.map(team => {
            // Use either primary_color from DB or fallback to color field
            const backgroundColor = team.primary_color || team.color;
            const textColor = isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
            
            return (
              <div key={team.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className="h-24 flex items-center justify-center text-xl font-bold p-4" 
                  style={{ 
                    backgroundColor: backgroundColor,
                    color: textColor,
                    backgroundImage: team.secondary_color ? 
                      `linear-gradient(135deg, ${backgroundColor} 60%, ${team.secondary_color})` : undefined
                  }}
                >
                  {team.name}
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{team.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{team.memberCount?.toLocaleString() || 0} fans</span>
                    </div>
                    
                    {team.founded_year && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Founded {team.founded_year}</span>
                      </div>
                    )}
                    
                    {team.city && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Info className="w-4 h-4 mr-2" />
                        <span>{team.city}, {team.state}</span>
                      </div>
                    )}
                    
                    {team.stadium && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Info className="w-4 h-4 mr-2" />
                        <span>{team.stadium}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline">
                      <Link to={`/teams/${team.slug}/memories`}>View Memories</Link>
                    </Button>
                    <Button 
                      asChild
                      style={{ 
                        backgroundColor: team.primary_color || team.color,
                        color: textColor,
                        border: 'none'
                      }}
                    >
                      <Link to={`/teams/${team.slug}/memories/new`}>Create Memory</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

export default TeamGallery;
