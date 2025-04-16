import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Library, Album, PlusCircle, Settings, Users, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const NavItem = ({ to, icon: Icon, label, isActive }: { to: string; icon: React.ElementType; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <Icon className="h-5 w-5 mr-2" />
    <span>{label}</span>
  </Link>
);

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="hidden md:block">
      <div className="space-y-1">
        <NavItem to="/" icon={Home} label="Home" isActive={isActive('/')} />
        <NavItem to="/cards" icon={LayoutGrid} label="Cards" isActive={isActive('/cards')} />
        <NavItem to="/collections" icon={Library} label="Collections" isActive={isActive('/collections')} />
        <NavItem to="/series" icon={Album} label="Series" isActive={isActive('/series')} />
        <NavItem to="/decks" icon={Library} label="Decks" isActive={isActive('/decks')} />
        <NavItem to="/cards/create" icon={PlusCircle} label="Create Card" isActive={isActive('/cards/create')} />
        <NavItem to="/cards/auctions" icon={Users} label="Auctions" isActive={isActive('/cards/auctions')} />
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-1">
        {user?.role === 'admin' && (
          <NavItem to="/admin" icon={Shield} label="Admin" isActive={isActive('/admin')} />
        )}
        <NavItem to="/settings" icon={Settings} label="Settings" isActive={isActive('/settings')} />
        <div className="px-3 py-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
