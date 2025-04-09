
import { useLocation } from 'react-router-dom';
import { navigationGroups } from './navigationData';

export const useNavigationSection = () => {
  const location = useLocation();
  
  // Check if path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Get closest parent section for current location
  const getCurrentSection = (): string => {
    if (location.pathname === '/') return 'MAIN';
    
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (location.pathname.startsWith(item.path) && item.path !== '/') {
          return group.title;
        }
      }
    }
    
    return 'MAIN';
  };

  return {
    isActive,
    currentSection: getCurrentSection()
  };
};
