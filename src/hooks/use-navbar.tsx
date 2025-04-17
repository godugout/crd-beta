
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useNavbar() {
  const auth = useAuth();
  const { user, signOut } = auth;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      if (signOut) {
        await signOut();
        toast.success("Signed out successfully");
        navigate('/');
      }
    } catch (error: any) {
      toast.error("Error signing out", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getActiveSection = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      return pathParts[1]; // Returns 'cards', 'collections', etc.
    }
    return ''; // Home
  };

  return {
    user,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleSignOut,
    isActive,
    activeSection: getActiveSection()
  };
}
