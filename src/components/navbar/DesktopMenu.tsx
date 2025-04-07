import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package } from 'lucide-react';

const DesktopMenu = () => {
  return (
    <nav className="flex items-center space-x-6 text-sm">
      
      <NavLink 
        to="/gallery" 
        className={({ isActive }) => 
          isActive ? "font-medium text-cardshow-blue" : "text-cardshow-dark hover:text-cardshow-blue transition-colors"
        }
      >
        Gallery
      </NavLink>
      <NavLink 
        to="/collections" 
        className={({ isActive }) => 
          isActive ? "font-medium text-cardshow-blue" : "text-cardshow-dark hover:text-cardshow-blue transition-colors"
        }
      >
        Collections
      </NavLink>
      
      <NavLink 
        to="/packs" 
        className={({ isActive }) => 
          isActive ? "font-medium text-cardshow-blue flex items-center" : "text-cardshow-dark hover:text-cardshow-blue transition-colors flex items-center"
        }
      >
        <Package className="h-4 w-4 mr-1" />
        Memory Packs
      </NavLink>
      <NavLink 
        to="/editor" 
        className={({ isActive }) => 
          isActive ? "font-medium text-cardshow-blue" : "text-cardshow-dark hover:text-cardshow-blue transition-colors"
        }
      >
        Create Card
      </NavLink>
      <NavLink 
        to="/card-detector" 
        className={({ isActive }) => 
          isActive ? "font-medium text-cardshow-blue" : "text-cardshow-dark hover:text-cardshow-blue transition-colors"
        }
      >
        Card Detector
      </NavLink>
    </nav>
  );
};

export default DesktopMenu;
