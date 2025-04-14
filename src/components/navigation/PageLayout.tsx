
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import AppHeader from './AppHeader';
import MobileBottomNav from './MobileBottomNav';
import { useState } from 'react';
import MobileMenu from '../navbar/MobileMenu';
import { SecondaryNavbar } from './SecondaryNavbar';

interface PageLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  description?: string;
  fullWidth?: boolean;
  hideNavigation?: boolean;
  className?: string;
  canonicalPath?: string;
  hideBreadcrumbs?: boolean;
  actions?: React.ReactNode;
  hideDescription?: boolean;
  stats?: Array<{count?: number; label?: string}>;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };
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
  stats,
  onSearch,
  searchPlaceholder,
  primaryAction,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Convert ReactNode title to a string
  const stringTitle = React.isValidElement(title)
    ? String(title.props.children || 'CardShow')
    : typeof title === 'string'
      ? title
      : typeof title === 'number'
        ? String(title)
        : title !== null && title !== undefined
          ? String(title)
          : 'CardShow';
        
  // Convert description to string for the meta tag
  const stringDescription = typeof description === 'string'
    ? description
    : typeof description === 'number'
      ? String(description)
      : description !== null && description !== undefined
        ? String(description)
        : 'Digital card collection platform';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>{stringTitle}</title>
        <meta name="description" content={stringDescription} />
        {canonicalPath && <link rel="canonical" href={`https://cardshow.app${canonicalPath}`} />}
      </Helmet>
      
      {!hideNavigation && (
        <AppHeader />
      )}
      
      {!hideNavigation && (
        <SecondaryNavbar
          title={title}
          description={stringDescription}
          hideBreadcrumbs={hideBreadcrumbs}
          actions={actions}
          hideDescription={hideDescription}
          stats={stats}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          primaryAction={primaryAction}
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
