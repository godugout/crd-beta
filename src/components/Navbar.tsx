
import React from 'react';
import AppHeader from '@/components/navigation/AppHeader';

// This component exists for backward compatibility
// and simply wraps AppHeader to avoid breaking existing imports
const Navbar = () => {
  return <AppHeader />;
};

export default Navbar;
