
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavLink, UserInfo } from '../GlobalNavbar';

interface MobileMenuContentProps {
  links: NavLink[];
  user: UserInfo | undefined;
  onLinkClick: () => void;
  onSignOut: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  links,
  user,
  onLinkClick,
  onSignOut
}) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  return (
    <>
      <div className="px-2 pt-2 pb-3 space-y-1">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={onLinkClick}
          >
            {link.text}
          </Link>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 pb-3">
        {user ? (
          <div className="px-4 flex items-center">
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium">{user.name}</div>
            </div>
          </div>
        ) : null}
        
        <div className="mt-3 px-2 space-y-1">
          <Link
            to="/search"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={onLinkClick}
          >
            <Search className="inline h-5 w-5 mr-2" />
            Search
          </Link>
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={onLinkClick}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={onLinkClick}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  onLinkClick();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={onLinkClick}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenuContent;
