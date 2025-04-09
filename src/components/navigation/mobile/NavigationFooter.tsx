
import React from 'react';
import { Link } from 'react-router-dom';
import { SheetFooter } from "@/components/ui/sheet";
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { User } from '@/context/auth/types';

interface NavigationFooterProps {
  user: User | null;
  onSignOut: () => Promise<void>;
  onClose: () => void;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({ user, onSignOut, onClose }) => {
  return (
    <SheetFooter className="p-4 border-t">
      {user ? (
        <MobileTouchButton 
          variant="ghost" 
          className="w-full" 
          onClick={onSignOut}
          hapticFeedback={false}
        >
          Sign Out
        </MobileTouchButton>
      ) : (
        <MobileTouchButton 
          className="w-full" 
          hapticFeedback={false}
        >
          <Link to="/auth" onClick={onClose} className="w-full block text-center">
            Sign In
          </Link>
        </MobileTouchButton>
      )}
    </SheetFooter>
  );
};

export default NavigationFooter;
