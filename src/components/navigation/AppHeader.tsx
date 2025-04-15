
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { mainNavItems } from '@/config/navigation';
import LabsButton from '@/components/navigation/components/LabsButton';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import UserDropdown from '@/components/navbar/UserDropdown';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                CardShow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {mainNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`text-foreground/70 hover:text-primary dark:text-foreground/70 dark:hover:text-primary px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors ${
                  isActive(item.path) ? 'text-primary font-medium' : ''
                }`}
              >
                {item.title}
              </Link>
            ))}

            {/* Action Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              <Button asChild variant="ghost" size="icon">
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              
              <ThemeToggle />

              <LabsButton variant="icon" />
              
              {user ? (
                <UserDropdown user={user} onSignOut={signOut} />
              ) : (
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/cards/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Create Card</span>
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <LabsButton variant="icon" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNavigation isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};

export default AppHeader;
