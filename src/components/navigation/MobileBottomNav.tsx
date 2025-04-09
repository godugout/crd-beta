
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, Package, PlayCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileBottomBar, MobileTouchButton } from '@/components/ui/mobile-controls';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const location = useLocation();
  
  // Check if path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <MobileBottomBar className="flex items-center justify-around bg-background/90 backdrop-blur-sm border-t px-1 py-1.5">
      <MobileTouchButton
        hapticFeedback
        variant="ghost"
        size="icon"
        className={`rounded-full ${isActive('/') ? 'bg-accent text-accent-foreground' : ''}`}
        asChild
      >
        <Link to="/">
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
      </MobileTouchButton>
      
      <MobileTouchButton
        hapticFeedback
        variant="ghost"
        size="icon"
        className={`rounded-full ${isActive('/teams') ? 'bg-accent text-accent-foreground' : ''}`}
        asChild
      >
        <Link to="/teams">
          <Users className="h-5 w-5" />
          <span className="sr-only">Teams</span>
        </Link>
      </MobileTouchButton>
      
      <MobileTouchButton
        hapticFeedback
        variant="ghost"
        size="icon"
        className={`rounded-full ${isActive('/packs') ? 'bg-accent text-accent-foreground' : ''}`}
        asChild
      >
        <Link to="/packs">
          <Package className="h-5 w-5" />
          <span className="sr-only">Packs</span>
        </Link>
      </MobileTouchButton>
      
      <MobileTouchButton
        hapticFeedback
        variant="ghost"
        size="icon"
        className={`rounded-full ${isActive('/game-day') ? 'bg-accent text-accent-foreground' : ''}`}
        asChild
      >
        <Link to="/game-day">
          <PlayCircle className="h-5 w-5" />
          <span className="sr-only">Game Day</span>
        </Link>
      </MobileTouchButton>
      
      <Button
        onClick={onOpenMenu}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
    </MobileBottomBar>
  );
};

export default MobileBottomNav;
