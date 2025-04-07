
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

interface RouteMapping {
  path: string;
  label: string;
  parent?: string;
}

// Define route mappings for breadcrumb generation
const routeMappings: Record<string, RouteMapping> = {
  '': { path: '/', label: 'Home', parent: undefined },
  'cards': { path: '/cards', label: 'Cards', parent: '' },
  'gallery': { path: '/cards/gallery', label: 'Gallery', parent: 'cards' },
  'collections': { path: '/collections', label: 'Collections', parent: '' },
  'editor': { path: '/cards/create', label: 'Create Card', parent: 'cards' },
  'card-detector': { path: '/cards/detect', label: 'Detect Card', parent: 'cards' },
  'teams': { path: '/teams', label: 'Teams', parent: '' },
  'oakland': { path: '/teams/oakland', label: 'Oakland A\'s', parent: 'teams' },
  'memories': { path: '/teams/oakland/memories', label: 'Memories', parent: 'oakland' },
  'gameday': { path: '/experiences/gameday', label: 'Game Day Mode', parent: '' },
  'features': { path: '/features', label: 'Features', parent: '' },
  'admin': { path: '/admin', label: 'Admin', parent: '' },
  'auth': { path: '/auth', label: 'Sign In', parent: '' },
  'account': { path: '/account', label: 'Account', parent: '' },
};

// Extract breadcrumb path segments and labels
const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{path: string; label: string}> = [];
  
  // Always add home
  breadcrumbs.push({ path: '/', label: 'Home' });
  
  // Add path segments
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    
    // Try to find an exact match first
    if (routeMappings[segment]) {
      breadcrumbs.push({
        path: routeMappings[segment].path,
        label: routeMappings[segment].label
      });
    } else {
      // If no exact match, try to guess based on URL structure
      // This handles dynamic routes like /card/:id
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        path: currentPath,
        label: label
      });
    }
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
