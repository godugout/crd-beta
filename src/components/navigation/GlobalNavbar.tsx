import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useBrandTheme } from '@/context/BrandThemeContext';
import { useAuth } from '@/hooks/useAuth';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isMinimized = useMediaQuery('(min-width: 769px) and (max-width: 900px)');
  const { themes, themeId, setTheme, currentTheme } = useBrandTheme();
  const { signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else if (signOut) {
      signOut();
    }
  };

  const getLogo = () => {
    if (isMobile) {
      return (
        <img 
          src="/lovable-uploads/c23d9e1a-4645-4f50-a9e4-2a325e3b4a4d.png"
          alt="Cardshow Logo"
          className="h-8 w-auto"
        />
      );
    } else {
      return (
        <img 
          src="/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png"
          alt="CRD Logo" 
          className="h-10 w-auto"
        />
      );
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center mr-4">
          <Link to="/" className="flex items-center">
            {getLogo()}
            {!isMinimized && !isMobile && (
              <span className="ml-2 text-xl font-semibold hidden sm:inline-block">
                CardShow
              </span>
            )}
          </Link>
        </div>

        <Button 
          asChild
          variant="gradient" 
          size={isMobile ? "icon" : "default"}
          className="mr-4"
        >
          <Link to="/cards/create">
            <Plus className="h-4 w-4" />
            {!isMobile && <span>Create</span>}
          </Link>
        </Button>

        <nav className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex space-x-4">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.href}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="hidden md:flex items-center ml-auto space-x-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Star 
                  className="h-5 w-5" 
                  fill={currentTheme.primaryColor} 
                  stroke={currentTheme.primaryColor} 
                />
                <span className="sr-only">Change Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(themes).map((theme) => {
                const isSelected = theme.id === themeId;
                
                return (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className="flex items-center gap-2 py-2 px-3 cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span className="flex-1">{theme.name}</span>
                    {isSelected && <Star className="h-4 w-4" fill="currentColor" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/collections">
                    <span>My Collections</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cards">
                    <span>My Cards</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-14 inset-x-0 z-50 bg-background border-b border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  {link.text}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user ? (
                <div className="px-4 flex items-center">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{user.name}</div>
                  </div>
                </div>
              ) : null}
              
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/search"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  <Search className="inline h-5 w-5 mr-2" />
                  Search
                </Link>
                
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                      onClick={toggleMenu}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={toggleMenu}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default GlobalNavbar;
