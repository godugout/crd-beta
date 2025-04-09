
import React, { createContext, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Team } from '@/lib/types/TeamTypes';
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

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  currentPath: string;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumbs: [],
  currentPath: ''
});

interface BreadcrumbProviderProps {
  children: React.ReactNode;
  currentTeam?: Team | null;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ 
  children, 
  currentTeam 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Create the breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always add home
  breadcrumbs.push(createHomeBreadcrumb());
  
  if (pathSegments.length > 0) {
    // Create the handler chain
    const combinedHandler = createHandlerChain([
      handleTeamSegment,
      handleMainSection,
      handleComplexRoutes,
      handleSemanticSegments,
      handleIdSegment,
    ]);
    
    // Build breadcrumbs based on path segments and route mappings
    let currentPathSegment = '';
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPathSegment += `/${segment}`;
      
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
        currentPath: currentPathSegment,
        currentTeam
      };
      
      // Try the combined handler
      const breadcrumb = combinedHandler(handlerProps);
      
      if (breadcrumb) {
        breadcrumbs.push(breadcrumb);
      } else {
        // If no specialized handler worked, create a generic breadcrumb
        breadcrumbs.push(createGenericBreadcrumb(segment, currentPathSegment));
      }
    }
  }

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, currentPath }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// Custom hook to use the breadcrumb context
export const useBreadcrumbs = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};
