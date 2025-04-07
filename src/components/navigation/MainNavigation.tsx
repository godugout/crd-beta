
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Home,
  Image,
  Layers,
  PackageIcon,
  PlusSquare,
  PlayCircle,
  Users,
  Settings,
  User
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const MainNavigation: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  
  // Hide the desktop navigation on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Cards Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Cards</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li>
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
            <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
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
            <NavigationMenuTrigger>Teams</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/teams/oakland"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <div className="mb-2 mt-4 text-lg font-medium">Oakland A's</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Explore Oakland A's cards and memories
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/teams/oakland/memories"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        <Image className="h-4 w-4" /> Oakland Memories
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Browse fan memories of Oakland A's moments
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
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
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
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
        to="/experiences/gameday"
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
