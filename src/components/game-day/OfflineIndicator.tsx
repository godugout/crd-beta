
import React from 'react';
import { WifiOff, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OfflineIndicatorProps {
  itemCount?: number;
  className?: string;
  onSync?: () => Promise<void>;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  itemCount = 0, 
  className,
  onSync
}) => {
  return (
    <div className={cn(
      "bg-amber-50 border-b border-amber-200 p-2 text-sm text-amber-800 flex items-center justify-between",
      className
    )}>
      <div className="flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <span>
          You're offline. 
          {itemCount > 0 && (
            <span> {itemCount} item{itemCount !== 1 ? 's' : ''} will sync when connection is restored.</span>
          )}
        </span>
      </div>
      
      {onSync && itemCount > 0 && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
          onClick={onSync}
        >
          <Upload className="h-3 w-3 mr-1" />
          Try Sync Now
        </Button>
      )}
    </div>
  );
};

export default OfflineIndicator;
