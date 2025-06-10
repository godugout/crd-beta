
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MobileBottomNavigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/gallery', label: 'Gallery', icon: LayoutGrid },
    { to: '/cards/create', label: 'Create', icon: PlusCircle, isAction: true },
    { to: isAuthenticated ? '/account' : '/auth', label: isAuthenticated ? 'Profile' : 'Sign In', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive(item.to)
                ? 'text-[#006341]'
                : 'text-muted-foreground hover:text-foreground'
            } ${
              item.isAction 
                ? 'bg-gradient-to-t from-[#006341]/10 to-transparent' 
                : ''
            }`}
          >
            <item.icon className={`h-5 w-5 ${
              item.isAction 
                ? 'text-[#006341]' 
                : isActive(item.to) 
                  ? 'text-[#006341]' 
                  : ''
            }`} />
            <span className={`text-xs ${
              item.isAction 
                ? 'text-[#006341] font-medium' 
                : ''
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
