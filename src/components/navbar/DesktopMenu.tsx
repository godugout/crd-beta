
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={cn(
      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
      isActive
        ? 'text-cardshow-blue hover:text-cardshow-blue/90'
        : 'text-cardshow-slate hover:text-cardshow-dark'
    )}
  >
    {children}
  </Link>
);

interface DesktopMenuProps {
  user?: User;
  isActive: (path: string) => boolean;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ user, isActive }) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavLink to="/" isActive={isActive('/')}>
        Home
      </NavLink>
      <NavLink to="/gallery" isActive={isActive('/gallery')}>
        Gallery
      </NavLink>
      <NavLink to="/collections" isActive={isActive('/collections')}>
        Collections
      </NavLink>
      <NavLink to="/oakland-memories" isActive={isActive('/oakland-memories')}>
        A's Memories
      </NavLink>
      {user && (
        <NavLink to="/editor" isActive={isActive('/editor')}>
          Create Card
        </NavLink>
      )}
    </div>
  );
};
