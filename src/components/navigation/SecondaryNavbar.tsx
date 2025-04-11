
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Maximize, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

interface SecondaryNavbarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  hideBreadcrumbs?: boolean;
  hideDescription?: boolean;
  stats?: {
    count?: number;
    label?: string;
  }[];
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
}

export const SecondaryNavbar = ({
  title,
  description,
  actions,
  hideBreadcrumbs = false,
  hideDescription = false,
  stats = [],
  searchPlaceholder = "Search...",
  onSearch
}: SecondaryNavbarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-athletics-green-dark/20 border-b border-gray-200 dark:border-athletics-green-dark/30 transition-all duration-300",
      isCollapsed ? "py-2" : "py-3 md:py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          {/* Left side - Breadcrumbs and Title/Description */}
          <div className="flex flex-col min-w-0">
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
          
          {/* Center section - Stats and Search */}
          <div className={cn(
            "flex-grow transition-all duration-300 md:mx-4 max-w-md",
            isCollapsed ? "h-8 opacity-100" : "opacity-100"
          )}>
            <div className="flex items-center gap-4">
              {/* Stats display */}
              {stats.length > 0 && (
                <div className="hidden md:flex items-center space-x-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.count !== undefined && (
                        <span className="font-medium">{stat.count}</span>
                      )}
                      {" "}
                      {stat.label}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Search input */}
              {onSearch !== undefined && (
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              )}
            </div>
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
