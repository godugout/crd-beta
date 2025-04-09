
import { useLocation } from 'react-router-dom';
import { Team } from '@/lib/types/TeamTypes';
import { BreadcrumbItem } from './types';
import { 
  createHomeBreadcrumb, 
  createTeamsBreadcrumb, 
  createGenericBreadcrumb 
} from './commonHandlers';
import { 
  handleTeamSegment, 
  handleMainSection, 
  handleComplexRoutes 
} from './routeHandlers';
import { 
  handleSemanticSegments, 
  handleIdSegment 
} from './semanticHandlers';

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
    
    // Create shared props for handlers
    const handlerProps = {
      index: i,
      pathSegments,
      segment,
      currentPath,
      currentTeam
    };
    
    // Try each handler in sequence and use the first one that returns a breadcrumb
    const handlers = [
      () => handleTeamSegment(handlerProps),
      () => handleMainSection(handlerProps),
      () => handleComplexRoutes(handlerProps),
      () => handleSemanticSegments(handlerProps),
      () => handleIdSegment(handlerProps),
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

// Export types
export type { BreadcrumbItem };
