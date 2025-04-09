
import React from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
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
  fullWidth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  showBreadcrumbs = true,
  title,
  description,
  imageUrl,
  type = 'website',
  canonicalPath,
  fullWidth = false,
  maxWidth = '7xl'
}) => {
  return (
    <ResponsiveLayout 
      className={className}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      {/* Add MetaTags for improved sharing and SEO */}
      <MetaTags
        title={title}
        description={description}
        imageUrl={imageUrl}
        type={type}
        canonicalPath={canonicalPath}
      />
      
      {showBreadcrumbs && !fullWidth && (
        <div className="mb-4">
          <BreadcrumbNav />
        </div>
      )}
      
      {children}
    </ResponsiveLayout>
  );
};

export default PageLayout;
