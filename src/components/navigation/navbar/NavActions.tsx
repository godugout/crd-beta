
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle, User } from 'lucide-react';
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
        variant="soft" 
        size="sm"
        asChild
        className="hidden md:flex items-center hover:bg-white/15 relative"
      >
        <Link to="/labs">
          <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
          <span className="text-sm">Labs</span>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-400"></span>
        </Link>
      </Button>

      {/* User Profile Menu */}
      {user ? (
        <UserDropdownMenu user={user} onSignOut={onSignOut} />
      ) : (
        <Button variant="glass" size="sm" asChild className="rounded-xl">
          <Link to="/login" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>Sign In</span>
          </Link>
        </Button>
      )}

      {/* Create Card Button */}
      <CrdButton variant="spectrum" size="sm" asChild className="px-4 py-2">
        <Link to="/cards/create" className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-1" />
          Card
        </Link>
      </CrdButton>
    </div>
  );
};

export default NavActions;
