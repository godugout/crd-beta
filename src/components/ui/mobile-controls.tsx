
import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Button, ButtonProps } from './button';

interface MobileBottomBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const MobileBottomBar = forwardRef<HTMLDivElement, MobileBottomBarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900",
          className
        )}
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
    const handleTouchStart = () => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "active:scale-95 transition-transform",
          className
        )}
        onTouchStart={handleTouchStart}
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
