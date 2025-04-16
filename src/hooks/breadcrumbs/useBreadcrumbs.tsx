
import { useLocation } from 'react-router-dom';
import { Team } from '@/lib/types/teamTypes';
import { BreadcrumbItem, BreadcrumbHandlerProps } from './types';
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
import { createHandlerChain } from './createHandlerChain';

/**
 * Hook to generate breadcrumbs based on current route
 */
export const useBreadcrumbs = (currentTeam?: Team | null): BreadcrumbItem[] => {
  // Wrap useLocation in try/catch to handle usage outside Router context
  let location;
  try {
    location = useLocation();
  } catch (error) {
    console.warn('useBreadcrumbs: useLocation hook failed, router context might be missing');
    return [createHomeBreadcrumb()]; // Default to just home breadcrumb when no router
  }
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always add home
  breadcrumbs.push(createHomeBreadcrumb());
  
  if (pathSegments.length === 0) {
    return breadcrumbs;
  }
  
  // Create the handler chain
  const combinedHandler = createHandlerChain([
    handleTeamSegment,
    handleMainSection,
    handleComplexRoutes,
    handleSemanticSegments,
    handleIdSegment,
  ]);
  
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
    const handlerProps: BreadcrumbHandlerProps = {
      index: i,
      pathSegments,
      segment,
      currentPath,
      currentTeam
    };
    
    // Try the combined handler
    const breadcrumb = combinedHandler(handlerProps);
    
    if (breadcrumb) {
      breadcrumbs.push(breadcrumb);
    } else {
      // If no specialized handler worked, create a generic breadcrumb
      breadcrumbs.push(createGenericBreadcrumb(segment, currentPath));
    }
  }
  
  return breadcrumbs;
};

// Re-export types
export type { BreadcrumbItem };
