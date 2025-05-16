import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useToast } from '@/components/ui/use-toast';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import AppHeader from '@/components/navigation/AppHeader';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';
import { logRenderingInfo } from '@/utils/debugRenderer';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  title,
  showHeader = true,
  showBottomNav = true
}) => {
  const isMobile = useIsMobile();
  const { isLowBandwidth, reduceEffects, viewportWidth } = useMobileOptimization();
  const { isOnline, offlineSince } = useConnectivity();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  
  // For performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logRenderingInfo('MobileOptimizedLayout', { 
        isMobile, 
        reduceEffects,
        isOnline,
        viewportWidth 
      });
    }
  }, [isMobile, reduceEffects, isOnline, viewportWidth]);
  
  // Track scroll position to hide/show the header on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Show offline toast when connection is lost
  useEffect(() => {
    if (!isOnline && offlineSince) {
      toast({
        title: "You're offline",
        description: "Some features may be limited. We'll sync your changes when you're back online.",
        duration: 5000,
      });
    } else if (isOnline && offlineSince) {
      toast({
        title: "You're back online",
        description: "Your changes have been synced.",
        duration: 3000,
      });
    }
  }, [isOnline, offlineSince, toast]);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Determine if we should use tablet optimizations (viewport between mobile and desktop)
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - hides on scroll down on mobile */}
      {showHeader && (
        <div 
          className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
            isMobile && isScrolled ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <AppHeader />
        </div>
      )}
      
      {/* Main Content */}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''} ${showBottomNav && isMobile ? 'pb-16' : ''}`}>
        {title && (
          <div className="p-4 md:py-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        
        {/* Apply different padding based on device type */}
        <div className={cn(
          isMobile ? "px-3" : isTablet ? "px-6" : "px-8",
          "transition-all duration-200"
        )}>
          {children}
        </div>
        
        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed bottom-20 inset-x-0 bg-yellow-500 text-white z-50 py-2 px-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <WifiOff className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">You're offline</span>
              </div>
              {offlineSince && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="text-white hover:bg-yellow-600"
                >
                  Try reconnecting
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Low Bandwidth Indicator */}
        {isOnline && isLowBandwidth && (
          <div className="fixed bottom-20 inset-x-0 bg-blue-500 text-white z-50 py-1 px-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <Wifi className="h-4 w-4 mr-2" />
                <span className="text-xs">Low bandwidth mode active</span>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {showBottomNav && isMobile && (
        <MobileBottomNav onOpenMenu={toggleMenu} />
      )}
      
      {/* Mobile Navigation Menu */}
      <MobileNavigation 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
      />
    </div>
  );
};

export default MobileOptimizedLayout;
