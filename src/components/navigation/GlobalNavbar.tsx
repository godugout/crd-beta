
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Import the newly created components
import NavbarLogo from './navbar/NavbarLogo';
import CreateButton from './navbar/CreateButton';
import DesktopNavLinks from './navbar/DesktopNavLinks';
import MobileNavToggle from './navbar/MobileNavToggle';
import NavActions from './navbar/NavActions';
import MobileMenuContent from './navbar/MobileMenuContent';

export interface NavLink {
  text: string;
  href: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
}

interface GlobalNavbarProps {
  links: NavLink[];
  user?: UserInfo;
  onSignOut?: () => void;
}

const GlobalNavbar: React.FC<GlobalNavbarProps> = ({ 
  links,
  user,
  onSignOut
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else if (signOut) {
      signOut();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavbarLogo />
        <CreateButton />
        <DesktopNavLinks links={links} />
        <MobileNavToggle isOpen={isMenuOpen} onClick={toggleMenu} />
        <NavActions user={user} onSignOut={handleSignOut} />

        {isMenuOpen && (
          <div className="md:hidden absolute top-14 inset-x-0 z-50 bg-background border-b border-gray-200 shadow-lg">
            <MobileMenuContent 
              links={links} 
              user={user} 
              onLinkClick={toggleMenu} 
              onSignOut={handleSignOut} 
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default GlobalNavbar;
