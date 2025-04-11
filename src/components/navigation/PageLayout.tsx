
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import AppHeader from './AppHeader';
import MobileBottomNav from './MobileBottomNav';
import { useState } from 'react';
import MobileMenu from '../navbar/MobileMenu';
import { SecondaryNavbar } from './SecondaryNavbar';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  fullWidth?: boolean;
  hideNavigation?: boolean;
  className?: string;
  canonicalPath?: string;
  hideBreadcrumbs?: boolean;
  actions?: React.ReactNode;
  hideDescription?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title = 'CardShow',
  description = 'Digital card collection platform',
  fullWidth = false,
  hideNavigation = false,
  className = '',
  canonicalPath,
  hideBreadcrumbs = false,
  actions,
  hideDescription = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonicalPath && <link rel="canonical" href={`https://cardshow.app${canonicalPath}`} />}
      </Helmet>
      
      {!hideNavigation && (
        <AppHeader />
      )}
      
      {!hideNavigation && (
        <SecondaryNavbar
          title={title}
          description={description}
          hideBreadcrumbs={hideBreadcrumbs}
          actions={actions}
          hideDescription={hideDescription}
        />
      )}
      
      <main className={`flex-grow ${className}`}>
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
    </div>
  );
};

export default PageLayout;
