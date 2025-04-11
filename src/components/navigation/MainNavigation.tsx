
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavigationSection, { NavigationItemProps } from './components/NavigationSection';
import TeamNavigation from './components/TeamNavigation';
import GameDayButton from './components/GameDayButton';
import { 
  cardsNavItems, 
  collectionsNavItems, 
  featuresNavItems,
  baseballNavItems
} from '@/config/navigation';

const MainNavigation: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  
  const getActiveSection = () => {
    const path = location.pathname;
    
    if (path === '/') return '';
    
    if (path.startsWith('/cards') || path === '/gallery' || path.startsWith('/detector')) {
      return 'cards';
    }
    
    if (path.startsWith('/collections') || path.startsWith('/packs')) {
      return 'collections';
    }
    
    if (path.startsWith('/teams')) {
      return 'teams';
    }
    
    if (
      path.startsWith('/ar-viewer') || 
      path.startsWith('/animation') ||
      path.startsWith('/game-day') ||
      path.startsWith('/labs')
    ) {
      return 'features';
    }

    if (path.startsWith('/baseball-archive')) {
      return 'baseball';
    }
    
    return '';
  };
  
  const activeSection = getActiveSection();
  
  if (isMobile) {
    return null;
  }

  // Updated mapNavItems function to handle the updated NavigationItem type
  const mapNavItems = (items: Array<any>): NavigationItemProps[] => {
    return items.map(item => ({
      title: item.title || item.label,
      path: item.path,
      icon: item.icon,
      description: item.description || '',
      highlight: item.highlight
    }));
  };

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationSection 
            title="Cards"
            items={mapNavItems(cardsNavItems)}
            isActive={activeSection === 'cards'}
            layout="grid"
            columns={2}
            featuredItem={{
              title: 'Card Animations',
              path: '/animation',
              description: 'Experience animated card effects',
              icon: featuresNavItems[1].icon
            }}
          />

          <NavigationSection 
            title="Collections"
            items={mapNavItems(collectionsNavItems)}
            isActive={activeSection === 'collections'}
            layout="list"
          />

          <TeamNavigation isActive={activeSection === 'teams'} />

          <NavigationSection 
            title="Features"
            items={mapNavItems(featuresNavItems)}
            isActive={activeSection === 'features'}
            layout="grid"
            columns={2}
          />
          
          <NavigationSection 
            title="Baseball Archive"
            items={mapNavItems(baseballNavItems)}
            isActive={activeSection === 'baseball'}
            layout="list"
            featuredItem={{
              title: 'Team Color History',
              path: '/baseball-archive',
              description: 'Explore MLB team color changes through history',
              icon: baseballNavItems[0].icon
            }}
          />
        </NavigationMenuList>
      </NavigationMenu>

      <GameDayButton />
    </div>
  );
};

export default MainNavigation;
