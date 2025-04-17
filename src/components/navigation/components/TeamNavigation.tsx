
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Users } from 'lucide-react';
import { teamsNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface TeamNavigationProps {
  isActive?: boolean;
}

const TeamNavigation: React.FC<TeamNavigationProps> = ({ isActive = false }) => {
  // Featured teams with logos
  const featuredTeams = [
    {
      name: 'Oakland A\'s',
      path: '/teams/oakland',
      logo: '/logo-oak.png' // Make sure this path exists
    },
    {
      name: 'San Francisco Giants',
      path: '/teams/sf-giants',
      logo: '/logo-sfg.png' // Make sure this path exists
    }
  ];

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={isActive ? 'bg-accent' : ''}>
        Teams
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px]">
          {/* Teams grid/list */}
          <div className="grid gap-4">
            {/* Links to all teams and specific teams */}
            <ul className="grid grid-cols-2 gap-3">
              {teamsNavItems.map((item) => (
                <li key={item.path}>
                  <NavigationMenuLink asChild>
                    <Link
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none",
                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        item.highlight ? 'bg-[#EFB21E]/10 text-[#006341] font-medium' : ''
                      )}
                      to={item.path}
                    >
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />} {item.title}
                      </div>
                      {item.description && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
            
            {/* Featured teams with logos */}
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium leading-none">Featured Teams</h4>
              <div className="flex gap-4 mt-3">
                {featuredTeams.map((team) => (
                  <Link
                    key={team.path}
                    to={team.path}
                    className="flex flex-col items-center justify-center gap-1 text-center"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="h-10 w-10 object-contain" />
                      ) : (
                        <Users className="h-6 w-6" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{team.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default TeamNavigation;
