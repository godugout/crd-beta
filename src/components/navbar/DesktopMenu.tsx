
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Grid3X3, Image, FolderOpen, Sparkles, Cube, Layers, Play } from 'lucide-react';

interface DesktopMenuProps {
  user: User | null;
  isActive: (path: string) => boolean;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ user, isActive }) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/gallery">
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-1.5",
                  isActive('/gallery') && "bg-blue-50 text-cardshow-blue"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Gallery</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/collections">
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-1.5",
                  isActive('/collections') && "bg-blue-50 text-cardshow-blue"
                )}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Collections</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/editor">
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-1.5",
                  isActive('/editor') && "bg-blue-50 text-cardshow-blue"
                )}
              >
                <Image className="h-4 w-4" />
                <span>Create</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className={cn(
                "flex items-center gap-1.5"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>Demos</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] grid-cols-2">
                <Link
                  to="/signature"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">Signature Demo</div>
                  <div className="text-xs text-muted-foreground">
                    Test our signature verification system
                  </div>
                </Link>
                <Link
                  to="/pbr"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">PBR Demo</div>
                  <div className="text-xs text-muted-foreground">
                    Explore physically-based rendering for cards
                  </div>
                </Link>
                <Link
                  to="/card-detector"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">Card Detector</div>
                  <div className="text-xs text-muted-foreground">
                    Automatically detect and crop cards from images
                  </div>
                </Link>
                <Link
                  to="/baseball-card-viewer"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">Baseball Cards</div>
                  <div className="text-xs text-muted-foreground">
                    Explore our interactive baseball card viewer
                  </div>
                </Link>
                <Link
                  to="/ar-card-viewer"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">AR Card Viewer</div>
                  <div className="text-xs text-muted-foreground">
                    Experience cards in augmented reality
                  </div>
                </Link>
                <Link
                  to="/card-comparison"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">Card Comparison</div>
                  <div className="text-xs text-muted-foreground">
                    Compare multiple cards side by side
                  </div>
                </Link>
                <Link
                  to="/card-animation"
                  className="group flex flex-col gap-1 p-3 rounded-md hover:bg-blue-50"
                >
                  <div className="text-sm font-medium">Animation Studio</div>
                  <div className="text-xs text-muted-foreground">
                    Create animated card transitions
                  </div>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopMenu;
