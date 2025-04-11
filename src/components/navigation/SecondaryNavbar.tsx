
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Maximize } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/breadcrumbs/BreadcrumbContext';
import { BreadcrumbItemComponent } from '@/components/navigation/components/BreadcrumbItem';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecondaryNavbarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  hideBreadcrumbs?: boolean;
  hideDescription?: boolean;
}

export const SecondaryNavbar = ({
  title,
  description,
  actions,
  hideBreadcrumbs = false,
  hideDescription = false
}: SecondaryNavbarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { breadcrumbs } = useBreadcrumbs();
  const location = useLocation();
  
  // Hide on homepage
  if (location.pathname === '/') {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // If breadcrumbs are hidden and there's no title or actions, don't render anything
  if (hideBreadcrumbs && !title && !actions) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white dark:bg-athletics-green-dark/20 border-b border-gray-200 dark:border-athletics-green-dark/30 transition-all duration-300",
      isCollapsed ? "py-2" : "py-3 md:py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          {/* Left side - Breadcrumbs and Title/Description */}
          <div className="flex flex-col flex-grow min-w-0">
            {/* Breadcrumbs */}
            {!hideBreadcrumbs && breadcrumbs.length > 1 && (
              <div className={cn("transition-all duration-300", 
                isCollapsed ? "h-6 opacity-100" : "h-6 opacity-100"
              )}>
                <Breadcrumb className="text-sm">
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      
                      return (
                        <React.Fragment key={crumb.path}>
                          <BreadcrumbItemComponent crumb={crumb} isLast={isLast} />
                          
                          {!isLast && (
                            <BreadcrumbSeparator>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </BreadcrumbSeparator>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}
            
            {/* Title and Description */}
            {(title || description) && (
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
            )}
          </div>
          
          {/* Right side - Actions and Collapse Toggle */}
          <div className="flex items-center gap-2 mt-2 md:mt-0 justify-between md:justify-end">
            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
            
            {/* Collapse Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleCollapse}
              className="ml-2 h-8 w-8 p-0"
              aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
