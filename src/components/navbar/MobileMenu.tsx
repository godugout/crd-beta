import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onLinkClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-40 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onLinkClick}></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white p-4">
        <nav className="flex flex-col space-y-4">
          <NavLink 
            to="/gallery" 
            className={({ isActive }) => 
              isActive ? "font-medium text-cardshow-blue p-2" : "text-cardshow-dark p-2 hover:text-cardshow-blue transition-colors"
            }
            onClick={onLinkClick}
          >
            Gallery
          </NavLink>
          <NavLink 
            to="/collections" 
            className={({ isActive }) => 
              isActive ? "font-medium text-cardshow-blue p-2" : "text-cardshow-dark p-2 hover:text-cardshow-blue transition-colors"
            }
            onClick={onLinkClick}
          >
            Collections
          </NavLink>
          <NavLink 
            to="/packs" 
            className={({ isActive }) => 
              isActive ? "font-medium text-cardshow-blue p-2 flex items-center" : "text-cardshow-dark p-2 hover:text-cardshow-blue transition-colors flex items-center"
            }
            onClick={onLinkClick}
          >
            <Package className="h-4 w-4 mr-2" />
            Memory Packs
          </NavLink>
          <NavLink 
            to="/editor" 
            className={({ isActive }) => 
              isActive ? "font-medium text-cardshow-blue p-2" : "text-cardshow-dark p-2 hover:text-cardshow-blue transition-colors"
            }
            onClick={onLinkClick}
          >
            Create Card
          </NavLink>
          <NavLink 
            to="/card-detector" 
            className={({ isActive }) => 
              isActive ? "font-medium text-cardshow-blue p-2" : "text-cardshow-dark p-2 hover:text-cardshow-blue transition-colors"
            }
            onClick={onLinkClick}
          >
            Card Detector
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
