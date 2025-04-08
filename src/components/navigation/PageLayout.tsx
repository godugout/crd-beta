
import React from 'react';
import AppHeader from './AppHeader';
import BreadcrumbNav from './Breadcrumb';
import { cn } from '@/lib/utils';
import MetaTags from '@/components/shared/MetaTags';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  canonicalPath?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  showBreadcrumbs = true,
  title,
  description,
  imageUrl,
  type = 'website',
  canonicalPath
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Add MetaTags for improved sharing and SEO */}
      <MetaTags
        title={title}
        description={description}
        imageUrl={imageUrl}
        type={type}
        canonicalPath={canonicalPath}
      />
      
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
