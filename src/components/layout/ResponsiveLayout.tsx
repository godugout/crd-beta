
import React from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import AppHeader from '@/components/navigation/AppHeader';
import { Container } from '@/components/ui/container';
import { Toaster } from '@/components/ui/toaster';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  showHeader?: boolean;
  containerClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false,
  showHeader = true,
  containerClassName,
  maxWidth = '7xl'
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <AppHeader />}
      
      <main className={cn(
        "flex-grow pt-16", // Account for fixed header
        className
      )}>
        {fullWidth ? (
          children
        ) : (
          <Container 
            className={cn(
              "py-4 md:py-6",
              maxWidthClasses[maxWidth],
              containerClassName
            )}
          >
            {children}
          </Container>
        )}
      </main>
      
      <Toaster />
    </div>
  );
};

export default ResponsiveLayout;
