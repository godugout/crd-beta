
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
import { Home } from 'lucide-react';
import { routeMappings } from './components/NavigationItems';

// Build breadcrumb path from current location
const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{path: string; label: string}> = [];
  
  // Always add home
  breadcrumbs.push({ path: '/', label: 'Home' });
  
  if (pathSegments.length === 0) {
    return breadcrumbs;
  }
  
  // Build breadcrumbs based on path segments and route mappings
  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    
    // Special handling for common path patterns
    if (i === 0) {
      // First segment - check for main section
      if (routeMappings[segment]) {
        breadcrumbs.push({
          path: routeMappings[segment].path,
          label: routeMappings[segment].label
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
          label: routeMappings[combinedKey].label
        });
        continue;
      }
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

const BreadcrumbNav: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();
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
                  <BreadcrumbPage>
                    {index === 0 ? <Home className="h-3.5 w-3.5" /> : crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path}>
                      {index === 0 ? <Home className="h-3.5 w-3.5" /> : crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
