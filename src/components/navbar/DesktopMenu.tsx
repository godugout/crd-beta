
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DesktopMenuProps {
  isActive?: boolean;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ isActive = false }) => {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Navigation links
  const links = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/collections', label: 'Collections' },
    { to: '/teams', label: 'Teams' },
    { to: '/community', label: 'Community' }
  ];

  return (
    <div className="hidden md:ml-6 md:flex md:space-x-4">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-2 text-sm font-medium ${
            isActiveLink(link.to)
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-primary'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default DesktopMenu;
