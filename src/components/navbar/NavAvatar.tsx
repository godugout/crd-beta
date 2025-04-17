
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';

interface NavAvatarProps {
  user: User;
  onClick?: () => void;
}

const NavAvatar: React.FC<NavAvatarProps> = ({ user, onClick }) => {
  // Generate initials from user displayName, username, or email
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    } else if (user.username) {
      return user.username
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar 
      className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-cardshow-blue transition-colors"
      onClick={onClick}
    >
      {user.avatarUrl ? (
        <AvatarImage src={user.avatarUrl} alt={user.displayName || user.username || user.email} />
      ) : null}
      <AvatarFallback className="bg-cardshow-blue-light text-cardshow-blue text-xs font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default NavAvatar;
