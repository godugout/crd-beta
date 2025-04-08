
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  Image,
  Layers,
  PackageIcon,
  PlusSquare,
  PlayCircle,
  Users,
  Settings,
  User,
  ChevronDown
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Team interface for team selection/filtering
interface Team {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
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

const MainNavigation: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  
  // Determine active section from URL
  const getActiveSection = () => {
    const pathParts = location.pathname.split('/');
    return pathParts.length > 1 ? pathParts[1] : '';
  };
  
  const activeSection = getActiveSection();
  
  // Hide desktop navigation on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Cards Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={activeSection === 'cards' ? 'bg-accent' : ''}>
              Cards
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li className="col-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/cards/gallery"
                    >
                      <Image className="h-6 w-6 mb-2" />
                      <div className="mb-2 mt-4 text-lg font-medium">Card Gallery</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Browse and discover cards from various collections
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/cards/create"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        <PlusSquare className="h-4 w-4" /> Create New Card
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Design and publish your own custom cards
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/cards/detect"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        <Image className="h-4 w-4" /> Detect Cards
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Automatically detect and crop cards from images
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Collections Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={activeSection === 'collections' ? 'bg-accent' : ''}>
              Collections
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/collections"
                    >
                      <Layers className="h-6 w-6 mb-2" />
                      <div className="mb-2 mt-4 text-lg font-medium">All Collections</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Browse all card collections and sets
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/collections/new"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        <PlusSquare className="h-4 w-4" /> Create New Collection
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Create and organize a new collection of cards
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Teams Menu */}
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
                        to={`/teams/${team.slug}`}
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
                            to={`/teams/${team.slug}/create`}
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
                      to="/experiences/gameday"
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

          {/* Features Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={activeSection === 'features' ? 'bg-accent' : ''}>
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/features/ar-viewer"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">AR Card Viewer</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        View cards in augmented reality
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/features/baseball-viewer"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Baseball Card Viewer</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Interactive baseball card experience
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/features/card-comparison"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Card Comparison</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Compare cards side by side
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/features/animation"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Card Animation</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Animate card designs and effects
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Game Day Mode prominent link */}
      <Link
        to="/features/gameday"
        className={cn(
          "text-[#006341] bg-[#EFB21E]/10 hover:bg-[#EFB21E]/20",
          "px-3 py-2 rounded-md text-sm font-medium transition-colors"
        )}
      >
        Game Day Mode
      </Link>
    </div>
  );
};

export default MainNavigation;
