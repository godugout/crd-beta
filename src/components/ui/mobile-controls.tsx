import React, { forwardRef, useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface MobileTouchButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  pressHighlight?: boolean;
  href?: string;
}

export const MobileTouchButton = forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ hapticFeedback = false, pressHighlight = true, className, onClick, children, href, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    
    // Trigger haptic feedback if supported
    const triggerHapticFeedback = () => {
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate(15); // subtle vibration (15ms)
      }
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
      setIsPressed(true);
      if (hapticFeedback) {
        triggerHapticFeedback();
      }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      setIsPressed(false);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    };
    
    // Component cleanup
    useEffect(() => {
      return () => setIsPressed(false);
    }, []);
    
    const touchHighlightClass = isPressed && pressHighlight ? 'opacity-70' : '';
    
    // If href is provided, render as Link component
    if (href) {
      return (
        <Link 
          to={href}
          className={`${className} ${touchHighlightClass} transition-opacity inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
        >
          {children}
        </Link>
      );
    }
    
    // Otherwise render as Button
    return (
      <Button
        ref={ref}
        className={`${className} ${touchHighlightClass} transition-opacity`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

MobileTouchButton.displayName = 'MobileTouchButton';

export const MobileSwipeAction: React.FC<{
  children: React.ReactNode;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}> = ({ children, onSwipe }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  // Minimum distance for a swipe
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !onSwipe) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          onSwipe('left');
        } else {
          onSwipe('right');
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          onSwipe('up');
        } else {
          onSwipe('down');
        }
      }
    }
  };
  
  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

export const MobileBottomBar: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-50 ${className}`}>
      {children}
    </div>
  );
};

export const MobileActionFab: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ icon, onClick, className = '' }) => {
  return (
    <Button
      className={`rounded-full h-14 w-14 shadow-lg ${className}`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};
