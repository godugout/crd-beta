
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { mainNavItems } from '@/config/navigation';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  const isHomePage = location.pathname === '/';
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

  const handleSignInOut = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn("", "");
    }
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-athletics-green dark:bg-athletics-green-dark text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold text-white">
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
                className={`text-white/80 hover:text-athletics-gold dark:hover:text-athletics-gold px-3 py-2 rounded-lg hover:bg-athletics-green-light/20 transition-colors ${
                  isActive(item.path) ? 'text-athletics-gold font-medium' : ''
                }`}
              >
                {item.title}
              </Link>
            ))}

            {/* Action Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              <Button asChild variant="ghost" size="icon" className="text-white hover:bg-athletics-green-light/20">
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              
              <ThemeToggle />
              
              {user ? (
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-athletics-green-light/20">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleSignInOut} className="bg-athletics-gold text-gray-900 hover:bg-athletics-gold-dark">Sign In</Button>
              )}
              
              <Button asChild className="bg-athletics-gold text-gray-900 hover:bg-athletics-gold-dark">
                <Link to="/cards/create">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>+ Card</span>
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-white hover:bg-athletics-green-light/20"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-athletics-green border-t border-white/10 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="container px-4 py-3 space-y-1">
            {mainNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`block px-3 py-2 text-base font-medium rounded-lg hover:bg-athletics-green-light/20 ${
                  isActive(item.path) ? 'text-athletics-gold bg-athletics-green-light/20' : 'text-white/80'
                }`}
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                  {item.title}
                </span>
              </Link>
            ))}
            
            <div className="pt-4">
              <Button
                onClick={handleSignInOut}
                className="w-full mb-2 bg-athletics-gold text-gray-900 hover:bg-athletics-gold-dark"
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
              
              <Button asChild className="w-full bg-athletics-gold text-gray-900 hover:bg-athletics-gold-dark">
                <Link to="/cards/create" onClick={closeMenu}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>+ Card</span>
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
