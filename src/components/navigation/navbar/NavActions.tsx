
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from './ThemeSwitcher';
import UserDropdownMenu from './UserDropdownMenu';
import { UserInfo } from '../GlobalNavbar';

interface NavActionsProps {
  user?: UserInfo;
  onSignOut: () => void;
}

const NavActions: React.FC<NavActionsProps> = ({ user, onSignOut }) => {
  return (
    <div className="hidden md:flex items-center ml-auto space-x-3">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/search">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Link>
      </Button>

      <ThemeSwitcher />

      {user ? (
        <UserDropdownMenu user={user} onSignOut={onSignOut} />
      ) : (
        <Button variant="outline" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default NavActions;
