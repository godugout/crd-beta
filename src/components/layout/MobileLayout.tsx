
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Users, User, Menu } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useConnectivity } from '@/hooks/useConnectivity';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import Notifications from '@/components/Notifications';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isOnline } = useConnectivity();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position to hide/show the header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navigation */}
      <div className={`fixed top-0 left-0 right-0 bg-white border-b z-50 transition-transform ${
        isMobile && isScrolled ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <Navbar />
      </div>
      
      {/* Main Content */}
      <main className={`flex-grow pb-16 ${isMobile ? 'pt-16' : 'pt-16'}`}>
        {children}
        
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="fixed bottom-20 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
            You are offline. Some features may be limited.
          </div>
        )}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex justify-around items-center z-50">
          <Link to="/">
            <MobileTouchButton 
              variant="ghost"
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label="Home"
              hapticFeedback={true}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </MobileTouchButton>
          </Link>
          
          <Link to="/detector">
            <MobileTouchButton
              variant="ghost"
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/detector' ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label="Capture"
              hapticFeedback={true}
              aria-current={location.pathname === '/detector' ? 'page' : undefined}
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs mt-1">Capture</span>
            </MobileTouchButton>
          </Link>
          
          <Link to="/community">
            <MobileTouchButton
              variant="ghost"
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/community' ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label="Community"
              hapticFeedback={true}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Community</span>
            </MobileTouchButton>
          </Link>
          
          <Link to="/profile">
            <MobileTouchButton
              variant="ghost"
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label="Profile"
              hapticFeedback={true}
              aria-current={location.pathname === '/profile' ? 'page' : undefined}
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </MobileTouchButton>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <MobileTouchButton
                variant="ghost"
                className="flex flex-col items-center justify-center text-muted-foreground"
                aria-label="Menu"
                hapticFeedback={true}
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </MobileTouchButton>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="py-4">
                <h2 className="text-lg font-medium mb-4">Menu</h2>
                <nav className="space-y-2">
                  <Link to="/collections" className="block py-2 px-4 hover:bg-muted rounded-md">
                    Collections
                  </Link>
                  <Link to="/teams" className="block py-2 px-4 hover:bg-muted rounded-md">
                    Teams
                  </Link>
                  <Link to="/experiences/gameday" className="block py-2 px-4 hover:bg-muted rounded-md">
                    Game Day Mode
                  </Link>
                  <Link to="/group-memory-creator" className="block py-2 px-4 hover:bg-muted rounded-md">
                    Group Memory
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
