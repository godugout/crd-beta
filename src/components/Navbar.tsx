
import React from 'react';
import { SecondaryNavbar } from '@/components/navigation/SecondaryNavbar';

// This component exists for backward compatibility
// Now uses SecondaryNavbar which includes the integrated header
const Navbar = () => {
  return <SecondaryNavbar title="CardShow" description="Digital card collection platform" />;
};

export default Navbar;
