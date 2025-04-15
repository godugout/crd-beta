
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/breadcrumbs/BreadcrumbContext';
import { BreadcrumbItemComponent } from '@/components/navigation/components/BreadcrumbItem';
import { cn } from '@/lib/utils';

interface BreadcrumbsNavigationProps {
  isCollapsed: boolean;
}

export const BreadcrumbsNavigation: React.FC<BreadcrumbsNavigationProps> = ({ isCollapsed }) => {
  const { breadcrumbs } = useBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <div className={cn("transition-all duration-300", 
      isCollapsed ? "h-6 opacity-100" : "h-6 opacity-100"
    )}>
      <Breadcrumb className="text-sm">
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
    </div>
  );
};
