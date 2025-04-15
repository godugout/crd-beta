
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Inbox, RefreshCw, Search, 
  PlusCircle, ImageOff, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type IconType = 
  | 'Inbox' 
  | 'AlertTriangle' 
  | 'Search' 
  | 'ImageOff' 
  | 'RefreshCw';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconType;
  onRefresh?: () => Promise<void>;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'Inbox',
  onRefresh,
  actionLabel,
  onAction,
  className
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Map icon string to component
  const IconComponent = {
    'Inbox': Inbox,
    'AlertTriangle': AlertTriangle,
    'Search': Search,
    'ImageOff': ImageOff,
    'RefreshCw': RefreshCw
  }[icon];
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {IconComponent && (
        <div className="rounded-full bg-muted p-3 mb-4">
          <IconComponent className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      <div className="flex gap-4">
        {onRefresh && (
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        )}
        
        {onAction && actionLabel && (
          <Button onClick={onAction}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
