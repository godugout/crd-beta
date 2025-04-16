
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, User, Menu, X, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { mainNavItems } from '@/config/navigation';
import { useBrandTheme } from '@/context/BrandThemeContext';
import ThemeSwitcher from '@/components/brand/ThemeSwitcher';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();
  const { currentTheme } = useBrandTheme();

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

  // Use the theme variables for styling
  const headerStyle = {
    backgroundColor: currentTheme.headerBackgroundColor,
    color: currentTheme.navTextColor
  };

  const navLinkStyle = (active: boolean) => ({
    color: active ? currentTheme.secondaryColor : `${currentTheme.navTextColor}cc`,
    backgroundColor: active ? `${currentTheme.primaryColor}33` : 'transparent'
  });

  const primaryButtonStyle = {
    backgroundColor: currentTheme.buttonPrimaryColor,
    color: currentTheme.buttonTextColor
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={headerStyle}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              {currentTheme.logo ? (
                <img 
                  src={currentTheme.logo} 
                  alt="Logo" 
                  className="h-8 w-auto mr-2" 
                />
              ) : (
                <span className="text-2xl font-bold" style={{ color: currentTheme.navTextColor }}>
                  CardShow
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {mainNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="px-3 py-2 rounded-lg transition-colors"
                style={navLinkStyle(isActive(item.path))}
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
              
              <ThemeSwitcher size="icon" showLabel={false} />
              <ThemeToggle />
              
              {user ? (
                <Button asChild variant="outline">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleSignInOut} style={primaryButtonStyle}>Sign In</Button>
              )}
              
              <Button asChild style={primaryButtonStyle}>
                <Link to="/cards/create">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>+ Card</span>
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeSwitcher size="icon" showLabel={false} />
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
        <div className="md:hidden border-t border-white/10 animate-in fade-in slide-in-from-top-5 duration-300" style={{ backgroundColor: currentTheme.headerBackgroundColor }}>
          <div className="container px-4 py-3 space-y-1">
            {mainNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="block px-3 py-2 text-base font-medium rounded-lg"
                style={navLinkStyle(isActive(item.path))}
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                  {item.title}
                </span>
              </Link>
            ))}
            
            <Link
              to="/brand-customization"
              className="block px-3 py-2 text-base font-medium rounded-lg"
              style={navLinkStyle(isActive('/brand-customization'))}
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Brand Customization
              </span>
            </Link>
            
            <div className="pt-4">
              <Button
                onClick={handleSignInOut}
                className="w-full mb-2"
                style={primaryButtonStyle}
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
              
              <Button asChild className="w-full" style={primaryButtonStyle}>
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
