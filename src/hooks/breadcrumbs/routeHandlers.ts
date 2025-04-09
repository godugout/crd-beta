
import React from 'react';
import { BreadcrumbHandlerProps, BreadcrumbItem } from './types';
import { routeMappings } from '@/components/navigation/components/NavigationItems';

// Helper for team segment handling
export const handleTeamSegment = ({
  index, 
  pathSegments, 
  segment,
  currentPath,
  currentTeam
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  if (index === 1 && pathSegments[0] === 'teams') {
    if (currentTeam) {
      return {
        path: currentPath,
        label: currentTeam.name,
        color: currentTeam.primary_color
      };
    } else {
      // Prettier team slug display if no team object
      const prettyName = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return {
        path: currentPath,
        label: prettyName
      };
    }
  }
  return null;
};

// Helper for main section handling
export const handleMainSection = ({
  index,
  segment
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  if (index === 0 && routeMappings[segment]) {
    const item: BreadcrumbItem = {
      path: routeMappings[segment].path,
      label: routeMappings[segment].label,
    };

    // Safely add icon if it exists
    if (routeMappings[segment].icon) {
      const IconComponent = routeMappings[segment].icon;
      item.icon = <IconComponent className="h-3.5 w-3.5" />;
    }

    return item;
  }
  return null;
};

// Helper for complex routes handling
export const handleComplexRoutes = ({
  index,
  pathSegments,
  segment,
  currentPath
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  if (index === 1 && pathSegments[index-1] && segment) {
    const combinedKey = segment;
    if (routeMappings[combinedKey]) {
      const item: BreadcrumbItem = {
        path: routeMappings[combinedKey].path,
        label: routeMappings[combinedKey].label,
      };

      // Safely add icon if it exists
      if (routeMappings[combinedKey].icon) {
        const IconComponent = routeMappings[combinedKey].icon;
        item.icon = <IconComponent className="h-3.5 w-3.5" />;
      }

      return item;
    }
  }
  return null;
};
