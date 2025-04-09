
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Users, PlayCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamNavigationProps {
  activeSection: string;
}

interface TeamNavigationItem {
  id: string;
  name: string;
  slug: string;
  primary_color?: string;
}

// Define the shape of the raw data coming from Supabase
interface TeamRecord {
  id: string;
  name: string;
}

const TeamNavigation: React.FC<TeamNavigationProps> = ({ activeSection }) => {
  const [teams, setTeams] = useState<TeamNavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Fetch teams from the database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name')
          .eq('is_active', true)
          .order('name')
          .limit(4);
          
        if (error) {
          console.error('Error fetching team navigation:', error);
          setTeams([]); // Use empty array when there's an error
          setLoading(false);
          return;
        }
          
        if (data && Array.isArray(data)) {
          // Map the raw data to our TeamNavigationItem format
          const teamData: TeamNavigationItem[] = data.map((team: TeamRecord) => ({
            id: team.id || '',
            name: team.name || '',
            slug: team.name ? team.name.toLowerCase().replace(/\s+/g, '-') : '',
            primary_color: undefined
          }));
          
          setTeams(teamData);
        } else {
          setTeams([]);
        }
      } catch (err) {
        console.error('Error in team navigation:', err);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  // Fallback teams if database fetch fails
  const fallbackTeams: TeamNavigationItem[] = [
    { 
      id: '1', 
      name: 'Oakland A\'s', 
      slug: 'oakland',
      primary_color: '#006341'
    },
    { 
      id: '2', 
      name: 'San Francisco Giants', 
      slug: 'sf-giants',
      primary_color: '#FD5A1E'
    },
    { 
      id: '3', 
      name: 'Los Angeles Dodgers', 
      slug: 'la-dodgers',
      primary_color: '#005A9C'
    },
    {
      id: '4',
      name: 'New York Yankees',
      slug: 'nyy',
      primary_color: '#003087'
    }
  ];

  const displayTeams = teams.length > 0 ? teams : fallbackTeams;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={activeSection === 'teams' ? 'bg-accent' : ''}>
        Teams
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="p-4 w-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Team Memories</h3>
            <Link 
              to="/teams" 
              className="text-sm text-blue-600 hover:underline"
            >
              View All Teams
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {displayTeams.map((team) => (
                <div key={team.id} className="rounded-lg bg-white shadow-sm">
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md p-4 no-underline outline-none focus:shadow-md"
                    to={`/teams/${team.slug}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5" style={{ color: team.primary_color }} />
                      <span className="text-md font-medium" style={{ color: team.primary_color }}>
                        {team.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Link 
                        to={`/teams/${team.slug}/memories`}
                        className="block select-none space-y-1 rounded-md p-2 text-center bg-gray-50 hover:bg-gray-100 text-sm no-underline outline-none transition-colors"
                      >
                        <span>Memories</span>
                      </Link>
                      <Link 
                        to={`/teams/${team.slug}/memories/new`}
                        className="block select-none space-y-1 rounded-md p-2 text-center bg-gray-50 hover:bg-gray-100 text-sm no-underline outline-none transition-colors"
                      >
                        <span>Create Memory</span>
                      </Link>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <Link
              to="/game-day"
              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors bg-[#EFB21E]/10 text-[#006341] hover:bg-[#EFB21E]/20"
            >
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                <PlayCircle className="h-4 w-4" /> Game Day Mode
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                Capture live game moments and memories
              </p>
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default TeamNavigation;
