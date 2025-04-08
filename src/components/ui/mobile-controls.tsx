
import React, { forwardRef, useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

export interface MobileTouchButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  pressHighlight?: boolean;
}

export const MobileTouchButton = forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ hapticFeedback = false, pressHighlight = true, className, onClick, children, ...props }, ref) => {
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
