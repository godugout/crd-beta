
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

  // Primary navigation links with enhanced styling
  const primaryNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/collections', label: 'Collections' },
    { to: '/cards/create', label: 'Create' },
    { to: '/labs', label: 'Labs' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full nav-glass">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with enhanced branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group" onClick={closeMenu}>
              <div className="relative">
                {currentTheme.logo ? (
                  <img src={currentTheme.logo} alt="Logo" className="h-8 w-auto mr-3" />
                ) : (
                  <span className="text-2xl font-black text-white tracking-tight">
                    Card<span className="text-brand-gradient">Show</span>
                  </span>
                )}
                {/* Sharp accent corner */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tr opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden md:flex items-center space-x-2">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item relative ${
                  isActive(link.to) ? 'nav-item-active' : ''
                }`}
              >
                {link.label}
                {/* Active state indicator with sharp corner */}
                {isActive(link.to) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--brand-primary)] clip-corner-tr"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons with enhanced styling */}
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Button asChild variant="glass" size="sm" className="nav-button">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            
            {/* Enhanced Create Card Button */}
            <div className="relative">
              <CrdButton asChild variant="spectrum" size="sm" className="btn-sharp font-bold">
                <Link to="/cards/create" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Create
                </Link>
              </CrdButton>
              {/* Accent corner */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--brand-accent)] clip-corner-tr opacity-90"></div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="md:hidden nav-button"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-primary)] animate-in fade-in slide-in-from-top-5 duration-300 nav-glass">
          <div className="container px-6 py-4 space-y-2">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                  isActive(link.to)
                    ? 'bg-white/10 text-white border border-[var(--border-highlight)]'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/labs"
              className="block px-4 py-3 text-base font-semibold rounded-xl text-white/80 hover:bg-white/5 hover:text-white"
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-[var(--brand-warning)]" />
                Labs
              </span>
            </Link>
            
            <div className="pt-4 space-y-3">
              {!isAuthenticated && (
                <Button
                  asChild
                  variant="glass"
                  className="w-full nav-button font-semibold"
                  onClick={closeMenu}
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              
              <div className="relative">
                <CrdButton asChild variant="spectrum" className="w-full btn-sharp font-bold">
                  <Link to="/cards/create" onClick={closeMenu} className="flex items-center justify-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span>Create Card</span>
                  </Link>
                </CrdButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
