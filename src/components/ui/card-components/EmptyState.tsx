
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

interface EmptyStateProps {
  /**
   * Title text
   */
  title: string;
  
  /**
   * Description text
   */
  description: string;
  
  /**
   * Optional icon to display (from Lucide icons)
   */
  icon?: keyof typeof LucideIcons;
  
  /**
   * Optional action button text
   */
  actionLabel?: string;
  
  /**
   * Optional action button callback
   */
  onAction?: () => void;
  
  /**
   * Optional class names to apply
   */
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon = 'Inbox',
  actionLabel,
  onAction,
  className = ""
}: EmptyStateProps) => {
  // Get the icon component from the Lucide library
  const LucideIcon = icon ? LucideIcons[icon] : null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-gray-300",
      className
    )}>
      {LucideIcon && (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <LucideIcon className="h-6 w-6 text-gray-500" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
