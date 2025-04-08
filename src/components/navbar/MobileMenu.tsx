
import React from 'react';
import MobileNavigation from '../navigation/MobileNavigation';
import { User } from '@/lib/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
  user?: User | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onSignOut, user }) => {
  // We now just use the MobileNavigation component
  return <MobileNavigation isOpen={isOpen} onClose={onClose} />;
};

export default MobileMenu;
