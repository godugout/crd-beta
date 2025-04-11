
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, PlusCircle, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  const isHomePage = location.pathname === '/';
  const isCardDetailPage = location.pathname.includes('/cards/') && !location.pathname.includes('/cards/create');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignInOut = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn("", "");
    }
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-litmus-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-litmus-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold bg-gradient-to-r from-litmus-green to-litmus-green-secondary bg-clip-text text-transparent">
                CardShow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/cards" 
              className="text-gray-600 hover:text-litmus-green dark:text-gray-200 dark:hover:text-litmus-green-light px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800 transition-colors"
            >
              Explore
            </Link>
            <Link 
              to="/collections" 
              className="text-gray-600 hover:text-litmus-green dark:text-gray-200 dark:hover:text-litmus-green-light px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800 transition-colors"
            >
              Collections
            </Link>
            <Link 
              to="/teams" 
              className="text-gray-600 hover:text-litmus-green dark:text-gray-200 dark:hover:text-litmus-green-light px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800 transition-colors"
            >
              Teams
            </Link>
            <Link 
              to="/community" 
              className="text-gray-600 hover:text-litmus-green dark:text-gray-200 dark:hover:text-litmus-green-light px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800 transition-colors"
            >
              Community
            </Link>

            {/* Action Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              <Button asChild variant="ghost" size="icon">
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              
              <ThemeToggle />
              
              {user ? (
                <Button asChild variant="outline">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleSignInOut}>Sign In</Button>
              )}
              
              <Button asChild className="btn-gradient">
                <Link to="/card/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Create Card</span>
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            
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
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-litmus-gray-900 border-t border-gray-200 dark:border-litmus-gray-800 animate-fade-in">
          <div className="container px-4 py-3 space-y-1">
            <Link 
              to="/cards" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800"
              onClick={closeMenu}
            >
              Explore
            </Link>
            <Link 
              to="/collections" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800"
              onClick={closeMenu}
            >
              Collections
            </Link>
            <Link 
              to="/teams" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800"
              onClick={closeMenu}
            >
              Teams
            </Link>
            <Link 
              to="/community" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-litmus-gray-800"
              onClick={closeMenu}
            >
              Community
            </Link>
            
            <div className="pt-4">
              <Button
                onClick={handleSignInOut}
                className="w-full mb-2"
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
              
              <Button asChild className="w-full btn-gradient">
                <Link to="/card/create" onClick={closeMenu}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Card
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
