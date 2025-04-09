
import React, { ReactNode, useState } from 'react';
import AppHeader from './AppHeader';
import BreadcrumbNav from './Breadcrumb';
import MobileNavigation from './MobileNavigation';
import MobileBottomNav from './MobileBottomNav';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  fullWidth?: boolean;
  hideBreadcrumb?: boolean;
  canonicalPath?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  children, 
  fullWidth = false,
  hideBreadcrumb = false,
  canonicalPath 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Update document title when component mounts
  React.useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | CardShow` : 'CardShow';
    
    // Set meta description if provided
    let metaDescription = document.querySelector('meta[name="description"]');
    if (description) {
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Set canonical link if provided
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalPath) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      // Base URL handling
      const baseUrl = window.location.origin;
      canonicalLink.setAttribute('href', `${baseUrl}${canonicalPath}`);
    }
    
    return () => {
      document.title = previousTitle;
      
      // Clean up canonical link when component unmounts
      if (canonicalLink && canonicalPath) {
        document.head.removeChild(canonicalLink);
      }
    };
  }, [title, description, canonicalPath]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      {!hideBreadcrumb && <BreadcrumbNav />}
      
      <main className={`flex-1 ${fullWidth ? '' : 'container mx-auto px-4 py-6'}`}>
        {children}
      </main>
      
      {/* Mobile menu and bottom navigation */}
      <MobileNavigation isOpen={isMenuOpen} onClose={handleCloseMenu} />
      
      {isMobile && (
        <MobileBottomNav onOpenMenu={handleOpenMenu} />
      )}
    </div>
  );
};

export default PageLayout;
