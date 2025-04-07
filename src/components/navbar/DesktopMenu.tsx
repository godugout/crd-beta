
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/lib/types';
import MainNavigation from '../navigation/MainNavigation';

interface DesktopMenuProps {
  isActive: (path: string) => boolean;
  user?: User;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ isActive, user }) => {
  // We now use the MainNavigation component
  return <MainNavigation />;
};

export default DesktopMenu;
