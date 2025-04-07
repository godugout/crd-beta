
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/navbar/MobileMenu';
import DesktopMenu from '@/components/navbar/DesktopMenu';
import UserDropdown from '@/components/navbar/UserDropdown';
import { useAuth } from '@/context/auth/useAuth'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center">
                <span className="font-bold text-xl text-gray-900">CardShow</span>
              </Link>
            </div>
            <DesktopMenu isActive={isActive} user={user} />
          </div>

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
      
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSignOut={signOut}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
