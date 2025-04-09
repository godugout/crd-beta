
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Menu, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';
import UserDropdown from '@/components/navbar/UserDropdown';
import { useAuth } from '@/context/auth'; // Updated import
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LabsButton from '../LabsButton';
import DugoutLabs from '../experimental/DugoutLabs';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const auth = useAuth();
  const user = auth?.user;
  const signOut = auth?.signOut;
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const shouldShowBackButton = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    return pathParts.length >= 3 || pathParts.some(part => part.match(/^[0-9a-fA-F-]+$/));
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-30 bg-white border-b transition-shadow ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
            
            <div className="hidden lg:ml-6 lg:flex">
              <MainNavigation />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Add Labs button */}
            <div className="hidden md:block">
              <DugoutLabs />
            </div>
            
            <div className="md:hidden">
              <LabsButton variant="icon" />
            </div>
            
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
