
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavbar } from '@/hooks/use-navbar';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';
import UserDropdown from './navbar/UserDropdown';
import NavAvatar from './navbar/NavAvatar';

const Navbar = () => {
  const { user, isMenuOpen, toggleMenu, closeMenu, handleSignOut, isActive } = useNavbar();
  const isMobile = useIsMobile();

  // For development, create a dummy user if no user exists
  const developmentUser = user || {
    id: 'dev-user-id',
    email: 'dev@example.com',
    name: 'Developer',
    avatarUrl: null
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-cardshow-dark">CardShow</span>
          </Link>

          {/* Desktop Navigation - Always show all options during development */}
          {!isMobile && <DesktopMenu user={developmentUser} isActive={isActive} />}

          {/* Right side - User menu or Sign In button */}
          <div className="flex items-center">
            {/* Always show avatar during development */}
            {!isMobile && (
              <div className="relative">
                <NavAvatar user={developmentUser} onClick={toggleMenu} />
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                onClick={toggleMenu}
                className="p-2 -mr-2 md:hidden text-cardshow-slate"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Always use development user */}
      {isMobile && (
        <MobileMenu 
          user={developmentUser} 
          isOpen={isMenuOpen} 
          onClose={closeMenu}
          onSignOut={handleSignOut}
        />
      )}
      
      {/* Desktop User Menu Dropdown - Always use development user */}
      {!isMobile && (
        <UserDropdown 
          user={developmentUser} 
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onSignOut={handleSignOut}
        />
      )}
    </nav>
  );
};

export default Navbar;
