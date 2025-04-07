
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth';

interface NavItemProps {
  href: string;
  text: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, text, isActive }) => (
  <Link
    to={href}
    className={cn(
      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
      isActive 
        ? 'bg-cardshow-blue-light text-cardshow-blue' 
        : 'text-cardshow-dark hover:bg-gray-100'
    )}
  >
    {text}
  </Link>
);

export const DesktopMenu: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden md:flex md:items-center md:space-x-1">
      <NavItem href="/" text="Home" isActive={isActive('/')} />
      <NavItem href="/gallery" text="Gallery" isActive={isActive('/gallery')} />
      <NavItem href="/collections" text="Collections" isActive={isActive('/collections')} />
      <NavItem href="/oakland-memories" text="A's Memories" isActive={isActive('/oakland-memories')} />
      {user && <NavItem href="/editor" text="Create Card" isActive={isActive('/editor')} />}
    </div>
  );
};
