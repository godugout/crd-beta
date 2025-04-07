
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/lib/types';

interface DesktopMenuProps {
  isActive: (path: string) => boolean;
  user?: User;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ isActive, user }) => {
  return (
    <div className="hidden lg:flex space-x-1">
      <Link
        to="/"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Home
      </Link>
      <Link
        to="/gallery"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/gallery') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Gallery
      </Link>
      <Link
        to="/collections"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/collections') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Collections
      </Link>
      <Link
        to="/editor"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/editor') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Create
      </Link>
      <Link
        to="/oakland"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/oakland') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Oakland A's
      </Link>
      <Link
        to="/gameday"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/gameday') 
            ? 'bg-[#006341] text-white' 
            : 'text-[#006341] bg-[#EFB21E]/10 hover:bg-[#EFB21E]/20'
        }`}
      >
        Game Day Mode
      </Link>
    </div>
  );
};

export default DesktopMenu;
