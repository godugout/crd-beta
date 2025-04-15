
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import AppHeader from './AppHeader';
import MobileBottomNav from './MobileBottomNav';
import { useState } from 'react';
import MobileMenu from '../navbar/MobileMenu';
import BreadcrumbNav from './Breadcrumb';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  fullWidth?: boolean;
  hideNavigation?: boolean;
  className?: string;
  canonicalPath?: string;
  hideBreadcrumbs?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title = 'CardShow',
  description = 'Digital card collection platform',
  fullWidth = false,
  hideNavigation = false,
  className = '',
  canonicalPath,
  hideBreadcrumbs = false, // Changed default to show breadcrumbs by default
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonicalPath && <link rel="canonical" href={`https://cardshow.app${canonicalPath}`} />}
      </Helmet>
      
      {!hideNavigation && (
        <AppHeader />
      )}
      
      {!hideBreadcrumbs && !hideNavigation && (
        <BreadcrumbNav />
      )}
      
      <main className={`min-h-[calc(100vh-4rem)] ${className}`}>
        {children}
      </main>
      
      {!hideNavigation && (
        <>
          <MobileBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />
          <MobileMenu 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)} 
            onSignOut={async () => {}} 
          />
        </>
      )}
    </>
  );
};

export default PageLayout;
