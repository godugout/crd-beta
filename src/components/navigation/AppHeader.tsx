
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';
import UserDropdown from '@/components/navbar/UserDropdown';
import { useAuth } from '@/context/auth/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden mr-2" 
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
              
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center">
                <span className="font-bold text-xl text-gray-900">CardShow</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <MainNavigation />
          </div>

          {/* Right side - Profile/Auth */}
          <div className="flex items-center">
            {user ? (
              <UserDropdown 
                user={user} 
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
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </header>
  );
};

export default AppHeader;
