
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/lib/types';

interface UserDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, isOpen, onClose, onSignOut }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="text-xs text-cardshow-slate truncate">{user.email}</div>
      </div>
      <Link
        to="/gallery"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        My Gallery
      </Link>
      <Link
        to="/collections"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        My Collections
      </Link>
      <button
        onClick={() => {
          onSignOut();
          onClose();
        }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  );
};

export default UserDropdown;
