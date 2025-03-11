
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';

interface NavAvatarProps {
  user: User;
  onClick: () => void;
}

const NavAvatar: React.FC<NavAvatarProps> = ({ user, onClick }) => {
  return (
    <Avatar 
      onClick={onClick}
      className="h-9 w-9 cursor-pointer ring-2 ring-white"
    >
      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default NavAvatar;
