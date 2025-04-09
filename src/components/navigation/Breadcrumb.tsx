
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Home, Users, ChevronRight } from 'lucide-react';
import { routeMappings } from './components/NavigationItems';
import { Team } from '@/lib/types/TeamTypes';
import { motion } from 'framer-motion';

interface BreadcrumbNavProps {
  currentTeam?: Team | null;
}

// Build breadcrumb path from current location
const useBreadcrumbs = (currentTeam?: Team | null) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{path: string; label: string; icon?: React.ReactNode; color?: string}> = [];
  
  // Always add home
  breadcrumbs.push({ path: '/', label: 'Home', icon: <Home className="h-3.5 w-3.5" /> });
  
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
    if (i === 1 && pathSegments[0] === 'teams') {
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
      continue;
    }
    
    // Special handling for common path patterns
    if (i === 0) {
      // First segment - check for main section
      if (routeMappings[segment]) {
        breadcrumbs.push({
          path: routeMappings[segment].path,
          label: routeMappings[segment].label,
          icon: routeMappings[segment].icon && <routeMappings[segment].icon className="h-3.5 w-3.5" />
        });
        continue;
      }
    }
    
    // Check for complex cases like collections/create or cards/batch
    if (i === 1 && pathSegments[i-1] && segment) {
      const combinedKey = `${segment}`;
      if (routeMappings[combinedKey]) {
        breadcrumbs.push({
          path: routeMappings[combinedKey].path,
          label: routeMappings[combinedKey].label,
          icon: routeMappings[combinedKey].icon && <routeMappings[combinedKey].icon className="h-3.5 w-3.5" />
        });
        continue;
      }
    }
    
    // Handle semantic path segments for memories and other content types
    if (segment === 'memories' && i > 1) {
      breadcrumbs.push({
        path: currentPath,
        label: 'Memories'
      });
      continue;
    }
    
    if (segment === 'new' && pathSegments[i-1] === 'memories') {
      breadcrumbs.push({
        path: currentPath,
        label: 'Create Memory'
      });
      continue;
    }
    
    // Handle IDs - they're usually parameters like :id
    if (segment.match(/^[0-9a-fA-F-]+$/)) {
      const prevSegment = i > 0 ? pathSegments[i-1] : '';
      
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

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ currentTeam }) => {
  const breadcrumbs = useBreadcrumbs(currentTeam);
  const location = useLocation();
  
  // Hide breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <Breadcrumb className="px-4 py-2 text-sm">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {crumb.icon ? crumb.icon : null}
                    <span style={crumb.color ? { color: crumb.color } : {}}>
                      {crumb.label}
                    </span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    asChild
                    className="flex items-center gap-1.5 transition-all hover:text-primary"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to={crumb.path} style={crumb.color ? { color: crumb.color } : {}}>
                        {crumb.icon ? crumb.icon : crumb.label}
                      </Link>
                    </motion.div>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
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
  );
};

export default BreadcrumbNav;
