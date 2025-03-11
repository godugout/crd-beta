
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PlusCircle, Grid, Edit3, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <NavLink 
            to="/" 
            className="text-xl font-semibold text-cardshow-dark tracking-tight"
          >
            Cardshow
          </NavLink>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              'text-sm font-medium transition-colors hover:text-cardshow-blue',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            Home
          </NavLink>
          <NavLink 
            to="/gallery" 
            className={({ isActive }) => cn(
              'text-sm font-medium transition-colors hover:text-cardshow-blue',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            Gallery
          </NavLink>
          <NavLink 
            to="/editor" 
            className={({ isActive }) => cn(
              'text-sm font-medium transition-colors hover:text-cardshow-blue',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            Create Card
          </NavLink>
        </nav>
        
        <div className="flex items-center space-x-4">
          <NavLink 
            to="/editor" 
            className="hidden sm:flex items-center justify-center rounded-full bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Card
          </NavLink>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex items-center justify-around h-16">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center w-1/4 py-2 transition-colors',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          <NavLink 
            to="/gallery" 
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center w-1/4 py-2 transition-colors',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            <Grid className="h-5 w-5" />
            <span className="text-xs mt-1">Gallery</span>
          </NavLink>
          <NavLink 
            to="/editor" 
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center w-1/4 py-2 transition-colors',
              isActive ? 'text-cardshow-blue' : 'text-cardshow-slate'
            )}
          >
            <Edit3 className="h-5 w-5" />
            <span className="text-xs mt-1">Create</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
