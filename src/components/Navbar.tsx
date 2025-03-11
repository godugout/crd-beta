import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Image, Grid3X3, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isMobile } = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        duration: 3000,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-cardshow-dark">CardShow</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <Link 
                    to="/gallery" 
                    className={cn(
                      "text-cardshow-slate hover:text-cardshow-blue transition-colors",
                      isActive('/gallery') && "text-cardshow-blue font-medium"
                    )}
                  >
                    Gallery
                  </Link>
                  <Link 
                    to="/collections" 
                    className={cn(
                      "text-cardshow-slate hover:text-cardshow-blue transition-colors",
                      isActive('/collections') && "text-cardshow-blue font-medium"
                    )}
                  >
                    Collections
                  </Link>
                  <Link 
                    to="/editor" 
                    className={cn(
                      "text-cardshow-slate hover:text-cardshow-blue transition-colors",
                      isActive('/editor') && "text-cardshow-blue font-medium"
                    )}
                  >
                    Create
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth" 
                    className="text-cardshow-slate hover:text-cardshow-blue transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right side - User menu or Sign In button */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <Avatar 
                  onClick={toggleMenu}
                  className="h-9 w-9 cursor-pointer ring-2 ring-white"
                >
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              !isMobile && (
                <Link to="/auth">
                  <Button className="bg-cardshow-blue hover:bg-cardshow-blue/90">Sign In</Button>
                </Link>
              )
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

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {user ? (
              <>
                <div className="border-b border-gray-100 py-4 mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-cardshow-slate truncate max-w-[200px]">{user.email}</div>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/gallery" 
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Grid3X3 size={18} className="mr-3 text-cardshow-slate" />
                  <span>Gallery</span>
                </Link>
                <Link 
                  to="/collections" 
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FolderOpen size={18} className="mr-3 text-cardshow-slate" />
                  <span>Collections</span>
                </Link>
                <Link 
                  to="/editor" 
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image size={18} className="mr-3 text-cardshow-slate" />
                  <span>Create New Card</span>
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }} 
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md w-full text-left"
                >
                  <LogOut size={18} className="mr-3 text-cardshow-slate" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-3 text-cardshow-slate" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Desktop User Menu Dropdown */}
      {!isMobile && user && isMenuOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-cardshow-slate truncate">{user.email}</div>
          </div>
          <Link
            to="/gallery"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            My Gallery
          </Link>
          <Link
            to="/collections"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            My Collections
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
