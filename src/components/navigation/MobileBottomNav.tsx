import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Image, Layers, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileBottomBar, MobileTouchButton } from '@/components/ui/mobile-controls';
import { mainNavItems } from '@/config/navigation';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const location = useLocation();
  
  // Primary navigation items for the bottom nav - using mainNavItems for consistency
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cards', label: 'Cards', icon: Image },
    { path: '/collections', label: 'Collections', icon: Layers },
    { path: '/teams', label: 'Teams', icon: Users },
  ];
  
  // Check if path is active - improved to handle nested routes
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    return location.pathname.startsWith(path);
  };
  
  return (
    <MobileBottomBar className="flex items-center justify-around bg-background/90 backdrop-blur-sm border-t px-1 py-1.5">
      {navItems.map((item) => (
        <MobileTouchButton
          key={item.path}
          hapticFeedback
          variant="ghost"
          size="icon"
          className={`rounded-full ${isActive(item.path) ? 'bg-accent text-accent-foreground' : ''}`}
          asChild
        >
          <Link to={item.path}>
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        </MobileTouchButton>
      ))}
      
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
