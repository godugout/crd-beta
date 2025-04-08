
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

// Define route mappings for breadcrumb generation with enhanced structure
const routeMappings: Record<string, RouteMapping> = {
  // Root
  '': { path: '/', label: 'Home', parent: undefined },
  
  // Cards section
  'cards': { path: '/cards', label: 'Cards', parent: '' },
  'gallery': { path: '/cards/gallery', label: 'Gallery', parent: 'cards' },
  'create': { path: '/cards/create', label: 'Create Card', parent: 'cards' },
  'detect': { path: '/cards/detect', label: 'Detect Card', parent: 'cards' },
  
  // Collections section
  'collections': { path: '/collections', label: 'Collections', parent: '' },
  'new': { path: '/collections/new', label: 'New Collection', parent: 'collections' },
  
  // Teams section
  'teams': { path: '/teams', label: 'Teams', parent: '' },
  'oakland': { path: '/teams/oakland', label: 'Oakland A\'s', parent: 'teams' },
  'memories': { path: '/teams/oakland/memories', label: 'Memories', parent: 'oakland' },
  
  // Experiences section
  'experiences': { path: '/experiences', label: 'Experiences', parent: '' },
  'gameday': { path: '/experiences/gameday', label: 'Game Day Mode', parent: 'experiences' },
  
  // Features section
  'features': { path: '/features', label: 'Features', parent: '' },
  'ar-viewer': { path: '/features/ar-viewer', label: 'AR Viewer', parent: 'features' },
  'baseball-viewer': { path: '/features/baseball-viewer', label: 'Baseball Cards', parent: 'features' },
  'card-comparison': { path: '/features/card-comparison', label: 'Card Comparison', parent: 'features' },
  'animation': { path: '/features/animation', label: 'Card Animation', parent: 'features' },
  'signature': { path: '/features/signature', label: 'Signature', parent: 'features' },
  'pbr': { path: '/features/pbr', label: 'PBR Demo', parent: 'features' },
  
  // Memory packs section
  'packs': { path: '/packs', label: 'Memory Packs', parent: '' },
  
  // Account section
  'account': { path: '/account', label: 'Account', parent: '' },
  
  // Auth section
  'auth': { path: '/auth', label: 'Sign In', parent: '' },
  
  // Admin section
  'admin': { path: '/admin', label: 'Admin', parent: '' },
};

// Build breadcrumb path from current location
const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{path: string; label: string}> = [];
  
  // Always add home
  breadcrumbs.push({ path: '/', label: 'Home' });
  
  // Build breadcrumbs based on path and mappings
  let currentPath = '';
  let currentSegments: string[] = [];
  
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    currentSegments.push(segment);
    
    // Try to find an exact match in our mappings
    if (routeMappings[segment]) {
      breadcrumbs.push({
        path: routeMappings[segment].path,
        label: routeMappings[segment].label
      });
    } else if (segment.match(/^[0-9a-fA-F-]+$/)) {
      // This looks like an ID - try to get the entity type from previous segment
      const prevSegment = currentSegments[currentSegments.length - 2];
      
      if (prevSegment === 'cards') {
        breadcrumbs.push({
          path: currentPath,
          label: 'Card Details'
        });
      } else if (prevSegment === 'collections') {
        breadcrumbs.push({
          path: currentPath,
          label: 'Collection'
        });
      } else if (prevSegment === 'memories') {
        breadcrumbs.push({
          path: currentPath,
          label: 'Memory Details'
        });
      } else if (prevSegment === 'packs') {
        breadcrumbs.push({
          path: currentPath,
          label: 'Memory Pack'
        });
      } else {
        // Generic ID label
        breadcrumbs.push({
          path: currentPath,
          label: 'Details'
        });
      }
    } else {
      // If no exact match, create a readable label from the segment
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
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
