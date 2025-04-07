import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/lib/types';
import { MobileTouchButton, MobileSwipeAction } from '@/components/ui/mobile-controls';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { HomeIcon, Image, PackageIcon, PlusSquare, Settings, Layers, PlayCircle, BarChart3, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
  user?: User;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onSignOut, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobileOptimization();

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' && isOpen) {
      onClose();
    }
  };

  const mainNavItems = [
    { title: 'Home', path: '/', icon: HomeIcon },
    { title: 'Cards', path: '/gallery', icon: Image },
    { title: 'Collections', path: '/collections', icon: Layers },
    { title: 'Memory Packs', path: '/packs', icon: PackageIcon },
  ];

  const creationItems = [
    { title: 'Create Card', path: '/editor', icon: PlusSquare },
  ];

  const experienceItems = [
    { title: 'Oakland A\'s', path: '/oakland', icon: Compass },
    { title: 'Game Day Mode', path: '/gameday', icon: PlayCircle, highlight: true },
  ];

  const featureItems = [
    { title: 'AR Card Viewer', path: '/ar-card-viewer', icon: Settings },
    { title: 'Card Comparison', path: '/card-comparison', icon: BarChart3 },
    { title: 'Card Animation', path: '/animation', icon: PlayCircle },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <MobileSwipeAction onSwipe={handleSwipe} className="h-full">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 text-left">
              <SheetTitle>CardShow</SheetTitle>
              <SheetDescription>
                Explore your digital card collection
              </SheetDescription>
            </SheetHeader>
            
            {user && (
              <div className="flex items-center space-x-4 p-4 bg-muted/30">
                <Avatar className="h-10 w-10">
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-800 font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-auto py-2">
              <div className="px-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">MAIN NAVIGATION</p>
                {mainNavItems.map((item) => (
                  <MobileTouchButton
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1",
                      location.pathname === item.path && "bg-muted font-medium"
                    )}
                    onClick={() => handleNavigation(item.path)}
                    hapticFeedback={false}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </MobileTouchButton>
                ))}
              </div>

              <Separator className="my-2" />
              
              <div className="px-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">CREATE</p>
                {creationItems.map((item) => (
                  <MobileTouchButton
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1",
                      location.pathname === item.path && "bg-muted font-medium"
                    )}
                    onClick={() => handleNavigation(item.path)}
                    hapticFeedback={false}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </MobileTouchButton>
                ))}
              </div>

              <Separator className="my-2" />
              
              <div className="px-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">EXPERIENCES</p>
                {experienceItems.map((item) => (
                  <MobileTouchButton
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1",
                      item.highlight && "bg-[#EFB21E]/10 text-[#006341] font-medium",
                      location.pathname === item.path && "bg-muted font-medium"
                    )}
                    onClick={() => handleNavigation(item.path)}
                    hapticFeedback={false}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </MobileTouchButton>
                ))}
              </div>

              <Separator className="my-2" />
              
              <div className="px-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">FEATURES</p>
                {featureItems.map((item) => (
                  <MobileTouchButton
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1",
                      location.pathname === item.path && "bg-muted font-medium"
                    )}
                    onClick={() => handleNavigation(item.path)}
                    hapticFeedback={false}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </MobileTouchButton>
                ))}
              </div>
            </div>
            
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
                  onClick={() => handleNavigation("/auth")}
                  hapticFeedback={false}
                >
                  Sign In
                </MobileTouchButton>
              )}
            </SheetFooter>
          </div>
        </MobileSwipeAction>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
