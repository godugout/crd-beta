
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Users, PlayCircle, Plus } from 'lucide-react';

// Team interface for team selection/filtering
interface Team {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

interface TeamNavigationProps {
  activeSection: string;
}

// Available teams for selection
const availableTeams: Team[] = [
  { 
    id: '1', 
    name: 'Oakland A\'s', 
    slug: 'oakland', 
    color: '#006341' 
  },
  { 
    id: '2', 
    name: 'San Francisco Giants', 
    slug: 'sf-giants', 
    color: '#FD5A1E' 
  },
  { 
    id: '3', 
    name: 'Los Angeles Dodgers', 
    slug: 'la-dodgers', 
    color: '#005A9C' 
  },
  // Add more teams as needed
];

const TeamNavigation: React.FC<TeamNavigationProps> = ({ activeSection }) => {
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
          
          <div className="grid grid-cols-2 gap-4">
            {availableTeams.slice(0, 4).map((team) => (
              <div key={team.id} className="rounded-lg bg-white shadow-sm">
                <Link
                  className="flex h-full w-full select-none flex-col justify-end rounded-md p-4 no-underline outline-none focus:shadow-md"
                  to={`/teams/${team.slug}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5" style={{ color: team.color }} />
                    <span className="text-md font-medium" style={{ color: team.color }}>
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
