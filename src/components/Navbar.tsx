
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './navbar/MobileMenu';
import NavAvatar from './navbar/NavAvatar';
import DesktopMenu from './navbar/DesktopMenu';
import UserDropdown from './navbar/UserDropdown';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-cardshow-blue">CardShow</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        {isMobile ? (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          // Desktop navigation
          <DesktopMenu />
        )}

        {/* User menu (authentication state) */}
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          )}
          
          {!loading && (
            user ? (
              <UserDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="default">Sign In</Button>
              </Link>
            )
          )}
        </div>
      </div>
      
      {/* Mobile menu (sidebar) */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSignOut={handleSignOut}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
