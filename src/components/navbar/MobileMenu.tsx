
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth';
import { 
  Home, 
  Grid, 
  FolderOpen, 
  PlusCircle,
  Camera,
  FileEdit,
  Layers,
  X,
  Box,
  Baseball
} from 'lucide-react';

interface NavItemProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, text, icon, isActive, onClick }) => (
  <Link
    to={href}
    className={cn(
      'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
      isActive 
        ? 'bg-cardshow-blue-light text-cardshow-blue' 
        : 'text-cardshow-dark hover:bg-gray-100'
    )}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    {text}
  </Link>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/25" onClick={onClose}></div>
      <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="font-bold text-xl text-cardshow-dark">Menu</div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-cardshow-slate hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-1">
            <NavItem 
              href="/" 
              text="Home" 
              icon={<Home size={20} />} 
              isActive={isActive('/')}
              onClick={onClose}
            />
            <NavItem 
              href="/gallery" 
              text="Gallery" 
              icon={<Grid size={20} />} 
              isActive={isActive('/gallery')}
              onClick={onClose}
            />
            <NavItem 
              href="/collections" 
              text="Collections" 
              icon={<FolderOpen size={20} />} 
              isActive={isActive('/collections')}
              onClick={onClose}
            />
            <NavItem 
              href="/oakland-memories" 
              text="A's Memories" 
              icon={<Baseball size={20} />} 
              isActive={isActive('/oakland-memories')}
              onClick={onClose}
            />
            {user && (
              <NavItem 
                href="/editor" 
                text="Create Card" 
                icon={<PlusCircle size={20} />} 
                isActive={isActive('/editor')}
                onClick={onClose}
              />
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm font-medium text-cardshow-slate mb-3">Tools</div>
            <div className="space-y-1">
              <NavItem 
                href="/card-detector" 
                text="Card Scanner" 
                icon={<Camera size={20} />} 
                isActive={isActive('/card-detector')}
                onClick={onClose}
              />
              <NavItem 
                href="/pbr" 
                text="3D Renderer" 
                icon={<Box size={20} />} 
                isActive={isActive('/pbr')}
                onClick={onClose}
              />
              <NavItem 
                href="/card-comparison" 
                text="Card Comparison" 
                icon={<Layers size={20} />} 
                isActive={isActive('/card-comparison')}
                onClick={onClose}
              />
              <NavItem 
                href="/signature" 
                text="Signature Analysis" 
                icon={<FileEdit size={20} />} 
                isActive={isActive('/signature')}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
