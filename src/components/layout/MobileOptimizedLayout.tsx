import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    showToastIfNewVisitor();
  }, [location]);

  const showToastIfNewVisitor = () => {
    if (!localStorage.getItem('mobile-optimized-viewed')) {
      localStorage.setItem('mobile-optimized-viewed', 'true');
      
      // Use toast.message instead of toast() for more flexible content
      toast.message('Mobile Optimized View', {
        description: 'This app has been optimized for mobile devices.',
        duration: 5000,
      });
      
      setTimeout(() => {
        toast.message('Tip: Save to Home Screen', {
          description: 'Add this app to your home screen for the best experience.',
          duration: 5000,
        });
      }, 6000);
    }
  };

  return <>{children}</>;
};

export default MobileOptimizedLayout;
