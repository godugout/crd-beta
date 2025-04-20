
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Menu, X, Palette, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { mainNavItems } from '@/config/navigation';
import { useBrandTheme } from '@/context/BrandThemeContext';
import ThemeSwitcher from '@/components/brand/ThemeSwitcher';
import { useNavbar } from '@/hooks/use-navbar';
import UserDropdown from '@/components/navbar/UserDropdown';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAuthenticated } = useAuth();
  const { currentTheme } = useBrandTheme();
  const { isActive } = useNavbar();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Use the theme variables for styling
  const headerStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  // Primary navigation links
  const primaryNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/collections', label: 'Collections' },
    { to: '/cards/create', label: 'Create' },
    { to: '/labs', label: 'Labs' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={headerStyle}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              {currentTheme.logo ? (
                <img src={currentTheme.logo} alt="Logo" className="h-8 w-auto mr-2" />
              ) : (
                <span className="text-2xl font-bold text-white">CardShow</span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* User Profile */}
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Button asChild variant="glass" size="sm" className="rounded-xl">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            
            {/* Create Card Button */}
            <CrdButton asChild variant="spectrum" size="sm" className="ml-2">
              <Link to="/cards/create" className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-1" />
                Card
              </Link>
            </CrdButton>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="md:hidden text-white/80 hover:text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 animate-in fade-in slide-in-from-top-5 duration-300" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
          <div className="container px-4 py-3 space-y-1">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 text-base font-medium rounded-lg ${
                  location.pathname === link.to
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/labs"
              className="block px-3 py-2 text-base font-medium rounded-lg text-white/80 hover:bg-white/5 hover:text-white"
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-400" />
                Labs
              </span>
            </Link>
            
            <div className="pt-4">
              {!isAuthenticated && (
                <Button
                  asChild
                  variant="glass"
                  className="w-full mb-2 rounded-xl"
                  onClick={closeMenu}
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              
              <CrdButton asChild variant="spectrum" className="w-full">
                <Link to="/cards/create" onClick={closeMenu} className="flex items-center justify-center">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>Create Card</span>
                </Link>
              </CrdButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
