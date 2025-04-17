
import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, PlusCircle, User } from 'lucide-react';
import { CrdButton } from '@/components/ui/crd-button';
import { Button } from '@/components/ui/button';
import UserDropdownMenu from './UserDropdownMenu';
import { UserInfo } from '../GlobalNavbar';

interface NavActionsProps {
  user?: UserInfo;
  onSignOut: () => void;
}

const NavActions: React.FC<NavActionsProps> = ({ user, onSignOut }) => {
  return (
    <div className="flex items-center ml-auto space-x-3">
      {/* Labs/Features Button */}
      <Button 
        variant="ghost" 
        size="sm"
        asChild
        className="hidden md:flex items-center hover:bg-white/15"
      >
        <Link to="/labs">
          <Beaker className="h-4 w-4 mr-2" />
          <span className="text-sm">Labs</span>
        </Link>
      </Button>

      {/* User Profile Menu */}
      {user ? (
        <UserDropdownMenu user={user} onSignOut={onSignOut} />
      ) : (
        <Button variant="ghost" size="sm" asChild className="rounded-xl">
          <Link to="/login" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>Sign In</span>
          </Link>
        </Button>
      )}

      {/* Create Card Button */}
      <CrdButton variant="spectrum" size="sm" asChild className="px-4">
        <Link to="/cards/create" className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-1" />
          <span>Card</span>
        </Link>
      </CrdButton>
    </div>
  );
};

export default NavActions;
