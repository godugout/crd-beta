
import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NavbarLogoProps {
  minimal?: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ minimal = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isMinimized = useMediaQuery('(min-width: 769px) and (max-width: 900px)');
  
  const getLogo = () => {
    if (isMobile) {
      return (
        <img 
          src="/lovable-uploads/c23d9e1a-4645-4f50-a9e4-2a325e3b4a4d.png"
          alt="Cardshow Logo"
          className="h-8 w-auto"
        />
      );
    } else {
      return (
        <img 
          src="/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png"
          alt="CRD Logo" 
          className="h-10 w-auto"
        />
      );
    }
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <Link to="/" className="flex items-center">
        {getLogo()}
        {!isMinimized && !isMobile && !minimal && (
          <span className="ml-2 text-xl font-semibold hidden sm:inline-block">
            CardShow
          </span>
        )}
      </Link>
    </div>
  );
};

export default NavbarLogo;
