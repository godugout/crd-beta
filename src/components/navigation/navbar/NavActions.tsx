
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdownMenu from './UserDropdownMenu';
import { UserInfo } from '../GlobalNavbar';

interface NavActionsProps {
  user?: UserInfo;
  onSignOut: () => void;
}

const NavActions: React.FC<NavActionsProps> = ({ user, onSignOut }) => {
  return (
    <div className="hidden md:flex items-center ml-auto space-x-3">
      {/* Labs/Features Button */}
      <Button 
        variant="ghost" 
        size="sm"
        asChild
        className="text-muted-foreground hover:text-primary"
      >
        <Link to="/labs">
          <Sparkles className="h-4 w-4 mr-1" />
          <span className="text-sm">Labs</span>
        </Link>
      </Button>

      {/* User Profile Menu */}
      {user ? (
        <UserDropdownMenu user={user} onSignOut={onSignOut} />
      ) : (
        <Button variant="outline" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      )}

      {/* Create Card Button */}
      <Button variant="gradient" asChild>
        <Link to="/cards/create" className="flex items-center">
          <span className="mr-1">+</span>
          Card
        </Link>
      </Button>
    </div>
  );
};

export default NavActions;
