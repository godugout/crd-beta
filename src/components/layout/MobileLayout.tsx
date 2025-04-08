
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { MobileBottomBar } from '@/components/ui/mobile-controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { Camera, Image, Layers, Home, User } from 'lucide-react';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import MobileNavigation from '@/components/navigation/MobileNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, hideNavigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { optimizeInteractions } = useMobileOptimization();

  const handleMenuToggle = () => {
    if (optimizeInteractions && navigator.vibrate) {
      navigator.vibrate(5); // Subtle feedback
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Standard navbar - visible on all pages */}
      <Navbar onMenuToggle={handleMenuToggle} />
      
      {/* Mobile navigation sidebar */}
      <MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Main content */}
      <main className="flex-1 pt-16 pb-20">
        {children}
      </main>
      
      {/* Mobile bottom navigation bar - only on mobile */}
      {isMobile && !hideNavigation && (
        <MobileBottomBar>
          <MobileTouchButton 
            variant="ghost" 
            className="flex flex-col items-center py-1"
            aria-label="Home"
            hapticFeedback={optimizeInteractions}
            aria-current={location.pathname === '/' ? 'page' : undefined}
            href="/"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-1">Home</span>
          </MobileTouchButton>
          
          <MobileTouchButton 
            variant="ghost" 
            className="flex flex-col items-center py-1"
            aria-label="Gallery"
            hapticFeedback={optimizeInteractions}
            aria-current={location.pathname.includes('/gallery') ? 'page' : undefined}
            href="/gallery"
          >
            <Image className="h-5 w-5" />
            <span className="text-[10px] mt-1">Gallery</span>
          </MobileTouchButton>
          
          <MobileTouchButton 
            variant="ghost" 
            className="flex flex-col items-center py-1 rounded-full bg-primary text-primary-foreground shadow-lg -mt-5 mb-0 aspect-square"
            aria-label="Capture"
            hapticFeedback={optimizeInteractions}
            href="/detector"
          >
            <Camera className="h-6 w-6" />
            <span className="text-[10px] mt-0.5">Capture</span>
          </MobileTouchButton>
          
          <MobileTouchButton 
            variant="ghost" 
            className="flex flex-col items-center py-1"
            aria-label="Collections"
            hapticFeedback={optimizeInteractions}
            aria-current={location.pathname.includes('/collections') ? 'page' : undefined}
            href="/collections"
          >
            <Layers className="h-5 w-5" />
            <span className="text-[10px] mt-1">Collections</span>
          </MobileTouchButton>
          
          <MobileTouchButton 
            variant="ghost" 
            className="flex flex-col items-center py-1"
            aria-label="Profile" 
            hapticFeedback={optimizeInteractions}
            aria-current={location.pathname.includes('/profile') ? 'page' : undefined}
            href="/profile"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-1">Profile</span>
          </MobileTouchButton>
        </MobileBottomBar>
      )}
    </div>
  );
};

export default MobileLayout;
