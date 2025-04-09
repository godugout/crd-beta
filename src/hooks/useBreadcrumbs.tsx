
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

export const useBreadcrumbs = (currentTeam?: Team | null): BreadcrumbItem[] => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always add home
  breadcrumbs.push({ 
    path: '/', 
    label: 'Home', 
    icon: <Home className="h-3.5 w-3.5" /> 
  });
  
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
      breadcrumbs.push({
        path: '/teams',
        label: 'Teams',
        icon: <Users className="h-3.5 w-3.5" />
      });
      continue;
    }
    
    // Handle team slugs - try to use currentTeam info if available
    if (handleTeamSegment(breadcrumbs, i, pathSegments, segment, currentPath, currentTeam)) {
      continue;
    }
    
    // Special handling for common path patterns
    if (handleMainSection(breadcrumbs, i, segment)) {
      continue;
    }
    
    // Check for complex cases like collections/create or cards/batch
    if (handleComplexRoutes(breadcrumbs, i, pathSegments, segment, currentPath)) {
      continue;
    }
    
    // Handle semantic path segments for memories and other content types
    if (handleSemanticSegments(breadcrumbs, i, pathSegments, segment, currentPath)) {
      continue;
    }
    
    // Handle IDs - they're usually parameters like :id
    if (handleIdSegment(breadcrumbs, i, pathSegments, segment, currentPath)) {
      continue;
    }
    
    // If no match found, create a readable label from the segment
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({
      path: currentPath,
      label: label
    });
  }
  
  return breadcrumbs;
};

// Helper function to handle team segments
const handleTeamSegment = (
  breadcrumbs: BreadcrumbItem[], 
  index: number, 
  pathSegments: string[], 
  segment: string,
  currentPath: string,
  currentTeam?: Team | null
): boolean => {
  if (index === 1 && pathSegments[0] === 'teams') {
    // This is a team slug path
    if (currentTeam) {
      breadcrumbs.push({
        path: currentPath,
        label: currentTeam.name,
        color: currentTeam.primary_color
      });
    } else {
      // Prettier team slug display if no team object
      const prettyName = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      breadcrumbs.push({
        path: currentPath,
        label: prettyName
      });
    }
    return true;
  }
  return false;
};

// Helper function to handle main section
const handleMainSection = (
  breadcrumbs: BreadcrumbItem[],
  index: number,
  segment: string
): boolean => {
  if (index === 0) {
    // First segment - check for main section
    if (routeMappings[segment]) {
      const item = {
        path: routeMappings[segment].path,
        label: routeMappings[segment].label,
      };

      // Safely add icon if it exists
      if (routeMappings[segment].icon) {
        const IconComponent = routeMappings[segment].icon;
        item['icon'] = <IconComponent className="h-3.5 w-3.5" />;
      }

      breadcrumbs.push(item);
      return true;
    }
  }
  return false;
};

// Helper function to handle complex routes
const handleComplexRoutes = (
  breadcrumbs: BreadcrumbItem[],
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): boolean => {
  if (index === 1 && pathSegments[index-1] && segment) {
    const combinedKey = `${segment}`;
    if (routeMappings[combinedKey]) {
      const item = {
        path: routeMappings[combinedKey].path,
        label: routeMappings[combinedKey].label,
      };

      // Safely add icon if it exists
      if (routeMappings[combinedKey].icon) {
        const IconComponent = routeMappings[combinedKey].icon;
        item['icon'] = <IconComponent className="h-3.5 w-3.5" />;
      }

      breadcrumbs.push(item);
      return true;
    }
  }
  return false;
};

// Helper function to handle semantic segments
const handleSemanticSegments = (
  breadcrumbs: BreadcrumbItem[],
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): boolean => {
  if (segment === 'memories' && index > 1) {
    breadcrumbs.push({
      path: currentPath,
      label: 'Memories'
    });
    return true;
  }
  
  if (segment === 'new' && pathSegments[index-1] === 'memories') {
    breadcrumbs.push({
      path: currentPath,
      label: 'Create Memory'
    });
    return true;
  }
  
  return false;
};

// Helper function to handle ID segments
const handleIdSegment = (
  breadcrumbs: BreadcrumbItem[],
  index: number,
  pathSegments: string[],
  segment: string,
  currentPath: string
): boolean => {
  if (segment.match(/^[0-9a-fA-F-]+$/)) {
    const prevSegment = index > 0 ? pathSegments[index-1] : '';
    
    // Determine entity type from previous segment
    let label = 'Details';
    if (prevSegment === 'cards') label = 'Card Details';
    else if (prevSegment === 'collections') label = 'Collection';
    else if (prevSegment === 'memories') label = 'Memory Details';
    else if (prevSegment === 'packs') label = 'Memory Pack';
    
    breadcrumbs.push({
      path: currentPath,
      label: label
    });
    return true;
  }
  return false;
};
