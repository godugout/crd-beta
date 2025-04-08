
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Menu, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';
import UserDropdown from '@/components/navbar/UserDropdown';
import { useAuth } from '@/context/auth';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const shouldShowBackButton = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    return pathParts.length >= 3 || pathParts.some(part => part.match(/^[0-9a-fA-F-]+$/));
  };
  
  const getBackUrl = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts.some(part => part.match(/^[0-9a-fA-F-]+$/))) {
      return '/' + pathParts.filter(part => !part.match(/^[0-9a-fA-F-]+$/)).join('/');
    }
    
    return '/' + pathParts.slice(0, -1).join('/');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {isMobile && shouldShowBackButton() ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2" 
                  onClick={() => window.history.back()}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden mr-2" 
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              )}
              
              <Link to="/" className="flex items-center">
                <span className="font-bold text-xl text-gray-900">CardShow</span>
              </Link>
            </div>
            
            <MainNavigation />
          </div>

          <div className="flex items-center">
            {user ? (
              <UserDropdown 
                user={user} 
                onSignOut={handleSignOut}
                isOpen={false} 
                onClose={() => {}} 
              />
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <MobileNavigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </header>
  );
};

export default AppHeader;
