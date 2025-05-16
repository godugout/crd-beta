
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ImagePlus, 
  Search, 
  Settings,
  UserRound,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      name: 'Create',
      path: '/create',
      icon: <ImagePlus className="h-5 w-5" />,
      exact: false,
    },
    {
      name: 'Gallery',
      path: '/gallery',
      icon: <Search className="h-5 w-5" />,
      exact: false,
    },
    {
      name: 'Personalize',
      path: '/personalize',
      icon: <Palette className="h-5 w-5" />,
      exact: false,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
      exact: false,
    },
    {
      name: 'Account',
      path: '/account',
      icon: <UserRound className="h-5 w-5" />,
      exact: false,
    },
  ];

  const isActiveLink = (path: string, exact: boolean) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="flex flex-col space-y-2 w-full">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={isActiveLink(item.path, item.exact) ? 'default' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActiveLink(item.path, item.exact) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
          asChild
        >
          <Link to={item.path}>
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default MainNavigation;
