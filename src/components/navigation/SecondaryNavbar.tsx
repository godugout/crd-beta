
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BreadcrumbsNavigation } from './secondary-navbar/BreadcrumbsNavigation';
import { TitleDescription } from './secondary-navbar/TitleDescription';
import { SearchInput } from './secondary-navbar/SearchInput';
import { StatsList } from './secondary-navbar/StatsList';
import { PrimaryActionButton } from './secondary-navbar/PrimaryActionButton';
import { CollapseButton } from './secondary-navbar/CollapseButton';

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
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };
}

export const SecondaryNavbar = ({
  title,
  description,
  actions,
  hideBreadcrumbs = false,
  hideDescription = false,
  stats = [],
  searchPlaceholder = "Search...",
  onSearch,
  primaryAction
}: SecondaryNavbarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  
  if (location.pathname === '/') {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
          <div className="flex flex-col min-w-0">
            {!hideBreadcrumbs && (
              <BreadcrumbsNavigation isCollapsed={isCollapsed} />
            )}
            
            <TitleDescription 
              title={title}
              description={description}
              isCollapsed={isCollapsed}
              hideDescription={hideDescription}
            />
          </div>
          
          <div className={cn(
            "flex-grow transition-all duration-300 md:mx-4 max-w-md",
            isCollapsed ? "h-8 opacity-100" : "opacity-100"
          )}>
            <div className="flex items-center gap-4">
              <StatsList stats={stats} />
              
              {onSearch !== undefined && (
                <SearchInput 
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0 justify-between md:justify-end">
            {primaryAction && (
              <PrimaryActionButton 
                action={primaryAction} 
                isCollapsed={isCollapsed} 
              />
            )}
            
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
            
            <CollapseButton 
              isCollapsed={isCollapsed}
              onToggle={toggleCollapse}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
