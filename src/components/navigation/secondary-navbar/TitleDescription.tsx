
import React from 'react';
import { cn } from '@/lib/utils';

interface TitleDescriptionProps {
  title?: string;
  description?: string;
  isCollapsed: boolean;
  hideDescription?: boolean;
}

export const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  description,
  isCollapsed,
  hideDescription = false
}) => {
  if (!title && !description) return null;
  
  return (
    <div className={cn(
      "transition-all duration-300 overflow-hidden",
      isCollapsed ? "h-0 opacity-0" : "opacity-100 mt-1",
      hideDescription ? "h-auto" : ""
    )}>
      {title && <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate">{title}</h1>}
      {!hideDescription && description && (
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-1">{description}</p>
      )}
    </div>
  );
};
