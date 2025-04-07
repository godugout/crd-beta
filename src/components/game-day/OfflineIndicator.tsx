
import React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  itemCount?: number;
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  itemCount = 0, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-amber-50 border-b border-amber-200 p-2 text-center text-sm text-amber-800 flex items-center justify-center",
      className
    )}>
      <WifiOff className="h-4 w-4 mr-2" />
      <span>
        You're offline. 
        {itemCount > 0 && (
          <span> {itemCount} item{itemCount !== 1 ? 's' : ''} will sync when connection is restored.</span>
        )}
      </span>
    </div>
  );
};

export default OfflineIndicator;
