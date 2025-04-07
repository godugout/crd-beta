
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Settings, CreditCard, HelpCircle, ChevronRight } from 'lucide-react';
import { User } from '@/lib/types';

interface UserDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => Promise<void>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ 
  user, 
  isOpen, 
  onClose,
  onSignOut
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-16 w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50">
      {/* User info */}
      <div className="p-4 border-b border-gray-100">
        <div className="font-medium text-cardshow-dark">{user.name || 'User'}</div>
        <div className="text-sm text-cardshow-slate truncate">{user.email}</div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <Link 
          to="/profile" 
          className="flex items-center px-4 py-2 text-sm text-cardshow-slate hover:bg-gray-50"
          onClick={onClose}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          My Profile
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Link>

        <Link 
          to="/account/settings" 
          className="flex items-center px-4 py-2 text-sm text-cardshow-slate hover:bg-gray-50"
          onClick={onClose}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Link>

        <Link 
          to="/account/billing" 
          className="flex items-center px-4 py-2 text-sm text-cardshow-slate hover:bg-gray-50"
          onClick={onClose}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Billing
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Link>

        <Link 
          to="/help" 
          className="flex items-center px-4 py-2 text-sm text-cardshow-slate hover:bg-gray-50"
          onClick={onClose}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help Center
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Link>
      </div>

      {/* Sign out */}
      <div className="border-t border-gray-100">
        <button
          onClick={onSignOut}
          className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
