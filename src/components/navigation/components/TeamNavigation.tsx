
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Users, PlayCircle } from 'lucide-react';

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
  // Add more teams as needed
];

const TeamNavigation: React.FC<TeamNavigationProps> = ({ activeSection }) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={activeSection === 'teams' ? 'bg-accent' : ''}>
        Teams
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
          {availableTeams.map((team) => (
            <li key={team.id}>
              <NavigationMenuLink asChild>
                <Link
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  to={`/teams/${team.slug}/memories`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6" style={{ color: team.color }} />
                    <span className="text-lg font-medium" style={{ color: team.color }}>
                      {team.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Link 
                      to={`/teams/${team.slug}/memories`}
                      className="block select-none space-y-1 rounded-md p-3 bg-white shadow-sm no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="text-sm font-medium">Memories</div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        Fan memories and moments
                      </p>
                    </Link>
                    <Link 
                      to={`/teams/${team.slug}/memories`}
                      className="block select-none space-y-1 rounded-md p-3 bg-white shadow-sm no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="text-sm font-medium">Create Memory</div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        Share your own memory
                      </p>
                    </Link>
                  </div>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
          <li>
            <NavigationMenuLink asChild>
              <Link
                to="/game-day"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-sm font-medium leading-none flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> Game Day Mode
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Capture live game moments and memories
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default TeamNavigation;
