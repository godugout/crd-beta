
import React from 'react';
import AppHeader from './AppHeader';
import BreadcrumbNav from './Breadcrumb';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  showBreadcrumbs = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className={cn(
        "flex-grow pt-16", // Account for fixed header
        className
      )}>
        {showBreadcrumbs && (
          <div className="max-w-7xl mx-auto w-full">
            <BreadcrumbNav />
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
