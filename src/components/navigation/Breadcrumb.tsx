
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import { Team } from '@/lib/types/TeamTypes';
import { useBreadcrumbs } from '@/hooks/breadcrumbs/BreadcrumbContext';
import { BreadcrumbItemComponent } from './components/BreadcrumbItem';

interface BreadcrumbNavProps {
  currentTeam?: Team | null;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ currentTeam }) => {
  const { breadcrumbs } = useBreadcrumbs();
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
              <BreadcrumbItemComponent crumb={crumb} isLast={isLast} />
              
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
