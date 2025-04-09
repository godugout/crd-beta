
import { useLocation } from 'react-router-dom';
import { routeMappings } from '@/components/navigation/components/NavigationItems';
import { Home, Users } from 'lucide-react';
import { Team } from '@/lib/types/TeamTypes';
import React from 'react';

export interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactNode; 
  color?: string;
}

// Base helper to create a home breadcrumb
const createHomeBreadcrumb = (): BreadcrumbItem => ({
  path: '/', 
  label: 'Home', 
  icon: <Home className="h-3.5 w-3.5" /> 
});

// Helper for team segment handling
const handleTeamSegment = (
  index: number, 
  pathSegments: string[], 
  segment: string,
  currentPath: string,
  currentTeam?: Team | null
): BreadcrumbItem | null => {
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
const handleMainSection = (
  index: number,
  segment: string
): BreadcrumbItem | null => {
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
const handleComplexRoutes = (
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): BreadcrumbItem | null => {
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

// Helper for semantic segments handling
const handleSemanticSegments = (
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): BreadcrumbItem | null => {
  if (segment === 'memories' && index > 1) {
    return {
      path: currentPath,
      label: 'Memories'
    };
  }
  
  if (segment === 'new' && pathSegments[index-1] === 'memories') {
    return {
      path: currentPath,
      label: 'Create Memory'
    };
  }
  
  return null;
};

// Helper for ID segments handling
const handleIdSegment = (
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): BreadcrumbItem | null => {
  if (segment.match(/^[0-9a-fA-F-]+$/)) {
    const prevSegment = index > 0 ? pathSegments[index-1] : '';
    
    // Determine entity type from previous segment
    let label = 'Details';
    if (prevSegment === 'cards') label = 'Card Details';
    else if (prevSegment === 'collections') label = 'Collection';
    else if (prevSegment === 'memories') label = 'Memory Details';
    else if (prevSegment === 'packs') label = 'Memory Pack';
    
    return {
      path: currentPath,
      label: label
    };
  }
  return null;
};

// Helper for generating generic breadcrumb item
const createGenericBreadcrumb = (segment: string, currentPath: string): BreadcrumbItem => {
  const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  return {
    path: currentPath,
    label: label
  };
};

// Helper for teams breadcrumb
const createTeamsBreadcrumb = (): BreadcrumbItem => ({
  path: '/teams',
  label: 'Teams',
  icon: <Users className="h-3.5 w-3.5" />
});

export const useBreadcrumbs = (currentTeam?: Team | null): BreadcrumbItem[] => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always add home
  breadcrumbs.push(createHomeBreadcrumb());
  
  if (pathSegments.length === 0) {
    return breadcrumbs;
  }
  
  // Build breadcrumbs based on path segments and route mappings
  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    
    // Special handling for teams section
    if (segment === 'teams' && i === 0) {
      breadcrumbs.push(createTeamsBreadcrumb());
      continue;
    }
    
    // Try each handler in sequence and use the first one that returns a breadcrumb
    const handlers = [
      () => handleTeamSegment(i, pathSegments, segment, currentPath, currentTeam),
      () => handleMainSection(i, segment),
      () => handleComplexRoutes(i, pathSegments, segment, currentPath),
      () => handleSemanticSegments(i, pathSegments, segment, currentPath),
      () => handleIdSegment(i, pathSegments, segment, currentPath),
    ];
    
    let handlerSucceeded = false;
    
    for (const handler of handlers) {
      const breadcrumb = handler();
      if (breadcrumb) {
        breadcrumbs.push(breadcrumb);
        handlerSucceeded = true;
        break;
      }
    }
    
    // If no specialized handler worked, create a generic breadcrumb
    if (!handlerSucceeded) {
      breadcrumbs.push(createGenericBreadcrumb(segment, currentPath));
    }
  }
  
  return breadcrumbs;
};
