
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/auth/useAuth';

interface NavigationFooterProps {
  onSignOut?: () => void;
  onClose?: () => void;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({ onSignOut, onClose }) => {
  const { user, signOut: authSignOut } = useAuth();
  
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else if (authSignOut) {
      authSignOut();
    }
  };
  
  if (!user) {
    return (
      <div className="mt-auto pt-4 border-t border-gray-200 px-4">
        <div className="flex flex-col gap-2 pb-4">
          <Button asChild variant="outline" className="w-full" onClick={onClose}>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="w-full" onClick={onClose}>
            <Link to="/register">Create account</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-auto pt-4 border-t border-gray-200 px-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <UserIcon size={16} className="text-primary-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.fullName || user.email}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 pb-4">
        <Button asChild variant="outline" size="sm" className="w-full justify-start" onClick={onClose}>
          <Link to="/settings">
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600" 
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default NavigationFooter;
