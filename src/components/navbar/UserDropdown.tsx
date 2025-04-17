
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon, Settings, LogOut, CreditCard, GaugeCircle } from 'lucide-react';

export interface UserDropdownProps {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  className,
  onOpenChange
}) => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };
  
  // Get the display name with appropriate fallbacks
  const getDisplayName = () => {
    return user.displayName || user.name || 'User';
  };

  // Get the first letter of the name or email for avatar fallback
  const getAvatarInitial = () => {
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    return user.email ? user.email.charAt(0).toUpperCase() : 'U';
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className={`outline-none ${className}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} alt={getDisplayName()} />
          <AvatarFallback className="bg-primary/10">
            {getAvatarInitial()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-medium">{getDisplayName()}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">
              <GaugeCircle className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cards">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Cards</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
