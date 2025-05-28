
import React from 'react';
import GlobalNavbar from '@/components/navigation/GlobalNavbar';

const NavbarExample: React.FC = () => {
  // Sample navigation links
  const navLinks = [
    { text: 'Home', href: '/' },
    { text: 'Gallery', href: '/gallery' },
    { text: 'Collections', href: '/collections' },
    { text: 'Teams', href: '/teams' },
    { text: 'Community', href: '/community' }
  ];
  
  // Sample user data - comment this out to see the non-authenticated state
  const user = {
    name: 'Jane Doe',
    avatar: '/lovable-uploads/d40cc3fa-02f3-4d26-8e3c-afdcd421a4a0.png',
  };
  
  const handleSignOut = () => {
    console.log('User signed out');
    // Implement your signout logic here
  };

  return (
    <div>
      <GlobalNavbar 
        links={navLinks} 
        user={user}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Navbar Example</h1>
        <p>This page demonstrates the GlobalNavbar component.</p>
      </main>
    </div>
  );
};

export default NavbarExample;
