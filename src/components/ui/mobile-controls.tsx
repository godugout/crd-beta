
import React, { ButtonHTMLAttributes, ReactNode, forwardRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Button, ButtonProps } from './button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileBottomBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const MobileBottomBar = forwardRef<HTMLDivElement, MobileBottomBarProps>(
  ({ children, className, ...props }, ref) => {
    // Add safe area padding for notched devices
    const [safeAreaBottom, setSafeAreaBottom] = useState(0);
    
    useEffect(() => {
      // Try to get the safe area inset bottom value
      try {
        const safeAreaInsetBottom = getComputedStyle(document.documentElement)
          .getPropertyValue('--sat-bottom')
          .trim();
          
        if (safeAreaInsetBottom) {
          setSafeAreaBottom(parseInt(safeAreaInsetBottom, 10) || 0);
        }
      } catch (error) {
        console.error('Error getting safe area inset:', error);
      }
    }, []);
    
    return (
      <div 
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t",
          className
        )}
        style={{ paddingBottom: safeAreaBottom ? `${safeAreaBottom}px` : undefined }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileBottomBar.displayName = 'MobileBottomBar';

interface MobileTouchButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  children: ReactNode;
}

export const MobileTouchButton = forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ children, className, hapticFeedback = false, ...props }, ref) => {
    const isMobile = useIsMobile();
    
    const handleTouchStart = () => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      // Prevent double-tap zoom on mobile
      if (isMobile) {
        e.preventDefault();
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "active:scale-95 transition-transform touch-manipulation",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

MobileTouchButton.displayName = 'MobileTouchButton';

export const MobileActionButton = forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <MobileTouchButton
        ref={ref}
        className={cn(
          "rounded-full shadow-lg", 
          className
        )}
        hapticFeedback={true}
        {...props}
      >
        {children}
      </MobileTouchButton>
    );
  }
);

MobileActionButton.displayName = 'MobileActionButton';

// Floating Action Button component for mobile
interface FloatingActionButtonProps extends ButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ children, className, position = 'bottom-right', ...props }, ref) => {
    const positionClasses = {
      'bottom-right': 'bottom-20 right-4',
      'bottom-left': 'bottom-20 left-4',
      'top-right': 'top-20 right-4',
      'top-left': 'top-20 left-4',
    };
    
    return (
      <MobileTouchButton
        ref={ref}
        className={cn(
          "fixed rounded-full shadow-lg z-40 size-12 md:size-14 flex items-center justify-center",
          positionClasses[position],
          className
        )}
        hapticFeedback={true}
        {...props}
      >
        {children}
      </MobileTouchButton>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
