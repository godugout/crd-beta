
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { 
  Home, 
  Image, 
  Package,
  Layers, 
  PlusSquare,
  Users,
  Settings,
  PlayCircle, 
  Sparkles,
  ArrowLeft,
  Menu,
  FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth/useAuth';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationGroup {
  title: string;
  items: {
    title: string;
    path: string;
    icon: React.ElementType;
    highlight?: boolean;
  }[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Define navigation groups for better organization with consistent paths
  const navigationGroups: NavigationGroup[] = [
    {
      title: "MAIN",
      items: [
        { title: 'Home', path: '/', icon: Home },
        { title: 'Cards', path: '/cards', icon: Image },
        { title: 'Collections', path: '/collections', icon: Layers },
        { title: 'Memory Packs', path: '/packs', icon: Package },
        { title: 'Teams', path: '/teams', icon: Users },
      ]
    },
    {
      title: "CREATE",
      items: [
        { title: 'Create Card', path: '/cards/create', icon: PlusSquare },
        { title: 'Create Collection', path: '/collections/create', icon: PlusSquare },
        { title: 'Create Memory Pack', path: '/packs/create', icon: PlusSquare },
        { title: 'Batch Operations', path: '/cards/batch', icon: Layers },
      ]
    },
    {
      title: "TEAMS",
      items: [
        { title: 'Oakland A\'s', path: '/teams/oakland', icon: Users },
        { title: 'Game Day Mode', path: '/game-day', icon: PlayCircle, highlight: true },
      ]
    },
    {
      title: "MEDIA",
      items: [
        { title: 'Media Library', path: '/media-library', icon: Image },
      ]
    },
    {
      title: "LABS",
      items: [
        { title: 'Dugout Labs', path: '/experimental', icon: FlaskConical, highlight: true },
        { title: 'Group Memory', path: '/group-memory', icon: Users },
      ]
    }
  ];

  // Check if path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle navigation and closing menu
  const handleNavigate = (path: string) => {
    onClose();
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    onClose();
  };
  
  // Get closest parent section for current location
  const getCurrentSection = (): string => {
    if (location.pathname === '/') return 'MAIN';
    
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (location.pathname.startsWith(item.path) && item.path !== '/') {
          return group.title;
        }
      }
    }
    
    return 'MAIN';
  };
  
  const currentSection = getCurrentSection();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 text-left border-b">
            <SheetTitle>CardShow</SheetTitle>
          </SheetHeader>
          
          {/* Back button for easy one-handed operation */}
          <div className="px-4 py-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Navigation sections */}
          <div className="flex-1 overflow-auto py-2">
            {navigationGroups.map((group, groupIndex) => (
              <div key={group.title} className={cn(
                "px-2 mb-4",
                // Highlight current section
                group.title === currentSection ? "bg-muted/50 rounded-md" : ""
              )}>
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
                
                {group.items.map((item) => (
                  <MobileTouchButton
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1",
                      item.highlight && "bg-[#EFB21E]/10 text-[#006341] font-medium",
                      item.title === 'Dugout Labs' && "bg-amber-50 text-amber-700",
                      isActive(item.path) && "bg-muted font-medium"
                    )}
                    onClick={() => handleNavigate(item.path)}
                    hapticFeedback={false}
                  >
                    <Link to={item.path} className="flex items-center w-full">
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </Link>
                  </MobileTouchButton>
                ))}
                
                {groupIndex < navigationGroups.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
          
          {/* Footer with authentication */}
          <SheetFooter className="p-4 border-t">
            {user ? (
              <MobileTouchButton 
                variant="ghost" 
                className="w-full" 
                onClick={handleSignOut}
                hapticFeedback={false}
              >
                Sign Out
              </MobileTouchButton>
            ) : (
              <MobileTouchButton 
                className="w-full" 
                hapticFeedback={false}
              >
                <Link to="/auth" onClick={onClose} className="w-full block text-center">
                  Sign In
                </Link>
              </MobileTouchButton>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
