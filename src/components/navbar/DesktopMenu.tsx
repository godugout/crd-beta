
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';

interface DesktopMenuProps {
  user: User | null;
  isActive: (path: string) => boolean;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ user, isActive }) => {
  return (
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
  );
};

export default DesktopMenu;
