
import { useLocation } from 'react-router-dom';
import { Team } from '@/lib/types/teamTypes'; 
import { BreadcrumbItem, BreadcrumbHandlerProps } from './types';
import { v4 as uuidv4 } from 'uuid';

// Handle team segment in routes
export const handleTeamSegment = ({
  index,
  pathSegments,
  segment,
  currentPath,
  currentTeam
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  // If segment follows 'teams' and looks like an ID
  if (index > 0 && pathSegments[index-1] === 'teams' && segment.match(/^[0-9a-zA-Z-]+$/)) {
    // If we have the current team data, use it
    if (currentTeam && currentTeam.id === segment) {
      return {
        id: `team-${currentTeam.id}`,
        path: currentPath,
        label: currentTeam.name,
        // Use primary_color instead of brandColor if it exists
        ...(currentTeam.primary_color && { color: currentTeam.primary_color })
      };
    }
    
    // Fallback if no team data
    return {
      id: `team-${segment}`,
      path: `${segment}`,
      label: `Team ${segment.substring(0, 6)}...`
    };
  }
  
  return null;
};

// Handle main navigation sections
export const handleMainSection = ({
  segment,
  currentPath,
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  const mainSections = ['cards', 'collections', 'series', 'decks', 'gallery', 'packs'];
  
  if (mainSections.includes(segment)) {
    return {
      id: `section-${segment}`,
      path: currentPath,
      label: segment.charAt(0).toUpperCase() + segment.slice(1)
    };
  }
  
  return null;
};

// Handle complex routes that require special breadcrumb naming
export const handleComplexRoutes = ({
  pathSegments,
  currentPath,
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  const routePath = pathSegments.join('/');
  
  // Special case handling
  if (routePath === 'teams/new') {
    return {
      id: 'new-team',
      path: currentPath,
      label: 'Create Team'
    };
  }
  
  if (routePath === 'teams/join') {
    return {
      id: 'join-team',
      path: currentPath,
      label: 'Join Team'
    };
  }
  
  return null;
};
