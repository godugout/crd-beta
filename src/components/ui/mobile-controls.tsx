import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { Link } from 'react-router-dom';

interface MobileTouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  hapticFeedback?: boolean;
  label?: string;
  href?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
}

export const MobileTouchButton = React.forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ className, variant = 'primary', size = 'md', hapticFeedback = true, label, onClick, href, children, ...props }, ref) => {
    const { isMobile } = useMobileOptimization();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hapticFeedback && isMobile && navigator.vibrate) {
        navigator.vibrate(10); // Subtle vibration feedback
      }
      
      onClick?.(e);
    };

    const buttonClassName = cn(
      'touch-manipulation relative',
      size === 'lg' && 'p-5 text-lg min-h-14',
      size === 'md' && 'p-4 text-base min-h-12',
      size === 'sm' && 'p-3 text-sm min-h-10',
      variant === 'icon' && 'aspect-square flex items-center justify-center',
      className
    );

    if (href) {
      return (
        <Link 
          to={href}
          className={buttonClassName}
          aria-current={props['aria-current']}
        >
          {children}
          {label && <span className="sr-only">{label}</span>}
        </Link>
      );
    }

    return (
      <Button
        className={buttonClassName}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
        {label && <span className="sr-only">{label}</span>}
      </Button>
    );
  }
);

MobileTouchButton.displayName = 'MobileTouchButton';

export const MobileBottomBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-2 px-4 flex items-center justify-around z-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileBottomBar.displayName = 'MobileBottomBar';

export const MobileActionFab = React.forwardRef<HTMLButtonElement, MobileTouchButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MobileTouchButton
        className={cn(
          'fixed bottom-20 right-4 rounded-full shadow-lg bg-cardshow-blue text-white h-14 w-14 flex items-center justify-center',
          className
        )}
        ref={ref}
        variant="icon"
        size="lg"
        hapticFeedback={false}
        {...props}
      >
        {children}
      </MobileTouchButton>
    );
  }
);

MobileActionFab.displayName = 'MobileActionFab';

export const MobileSwipeAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  threshold?: number;
}>(
  ({ className, onSwipe, threshold = 50, children, ...props }, ref) => {
    const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 });
    const { optimizeInteractions } = useMobileOptimization();
    
    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!optimizeInteractions || !onSwipe) return;
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        // Horizontal swipe
        onSwipe(deltaX > 0 ? 'right' : 'left');
      } else if (Math.abs(deltaY) > threshold) {
        // Vertical swipe
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    };
    
    return (
      <div
        className={cn('touch-manipulation', className)}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileSwipeAction.displayName = 'MobileSwipeAction';
