
import React, { ReactNode, useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import BreadcrumbNav from './Breadcrumb';
import MobileNavigation from './MobileNavigation';
import MobileBottomNav from './MobileBottomNav';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MetaTags from '@/components/shared/MetaTags';
import { AnimatePresence, motion } from 'framer-motion';
import { Team } from '@/lib/types/TeamTypes';
import { useNavigationState } from '@/hooks/useNavigationState';
import { BreadcrumbProvider } from '@/hooks/breadcrumbs/BreadcrumbContext';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  fullWidth?: boolean;
  hideBreadcrumb?: boolean;
  canonicalPath?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  team?: Team;
  contentId?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  keywords?: string[];
  transitions?: boolean;
  hideFooter?: boolean;
  gradient?: boolean;
  darkMode?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  children, 
  fullWidth = false,
  hideBreadcrumb = false,
  canonicalPath,
  imageUrl,
  type = 'website',
  team,
  contentId,
  publishedTime,
  modifiedTime,
  section,
  keywords,
  transitions = true,
  hideFooter = false,
  gradient = false,
  darkMode = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [scrollPosition, setScrollPosition] = useNavigationState({
    key: 'scrollPosition',
    defaultState: 0,
    sessionOnly: true
  });

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Restore scroll position when navigating back
  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
    }
  }, [scrollPosition]);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollPosition]);

  // Apply dark mode class if specified
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      return () => {
        document.documentElement.classList.remove('dark');
      };
    }
  }, [darkMode]);

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  const gradientClass = gradient ? 'bg-gradient-to-br from-white to-gray-100 dark:from-litmus-gray-900 dark:to-litmus-gray-800' : '';

  return (
    <BreadcrumbProvider currentTeam={team}>
      <div className={`min-h-screen flex flex-col ${gradientClass}`}>
        <MetaTags 
          title={title}
          description={description}
          canonicalPath={canonicalPath}
          imageUrl={imageUrl}
          type={type}
          teamName={team?.name}
          contentId={contentId}
          publishedTime={publishedTime}
          modifiedTime={modifiedTime}
          section={section}
          keywords={keywords}
        />
        
        <AppHeader />
        
        {!hideBreadcrumb && <BreadcrumbNav currentTeam={team} />}
        
        <AnimatePresence>
          {transitions ? (
            <motion.main
              className={`flex-1 ${fullWidth ? '' : 'container mx-auto px-4 py-6'}`}
              key={canonicalPath || location.pathname}
              {...pageTransition}
            >
              {children}
            </motion.main>
          ) : (
            <main className={`flex-1 ${fullWidth ? '' : 'container mx-auto px-4 py-6'}`}>
              {children}
            </main>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        {!hideFooter && (
          <footer className="bg-white dark:bg-litmus-gray-900 py-6 mt-8 border-t border-gray-200 dark:border-litmus-gray-800">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center items-center mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-litmus-purple to-litmus-purple-secondary bg-clip-text text-transparent">
                  CardShow
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} CardShow. All rights reserved.</p>
            </div>
          </footer>
        )}
        
        {/* Mobile menu and bottom navigation */}
        <MobileNavigation isOpen={isMenuOpen} onClose={handleCloseMenu} />
        
        {isMobile && (
          <MobileBottomNav onOpenMenu={handleOpenMenu} />
        )}
      </div>
    </BreadcrumbProvider>
  );
};

export default PageLayout;
