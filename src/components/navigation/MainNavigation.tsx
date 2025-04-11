
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
import { cardsNavItems, collectionsNavItems, featuresNavItems } from '@/config/navigationConfig';

const MainNavigation: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  
  // Determine active section from URL
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
    
    return '';
  };
  
  const activeSection = getActiveSection();
  
  // Hide desktop navigation on mobile devices
  if (isMobile) {
    return null;
  }

  // Convert navigation items to the format expected by NavigationSection component
  const mapNavItems = (items: typeof cardsNavItems): NavigationItemProps[] => {
    return items.map(item => ({
      title: item.label,  // Map label to title
      path: item.path,
      icon: item.icon,
      description: item.description,
      highlight: item.highlight
    }));
  };

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Cards Navigation */}
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

          {/* Collections Navigation */}
          <NavigationSection 
            title="Collections"
            items={mapNavItems(collectionsNavItems)}
            isActive={activeSection === 'collections'}
            layout="list"
          />

          {/* Teams Navigation - Custom component due to unique layout */}
          <TeamNavigation isActive={activeSection === 'teams'} />

          {/* Features Navigation */}
          <NavigationSection 
            title="Features"
            items={mapNavItems(featuresNavItems)}
            isActive={activeSection === 'features'}
            layout="grid"
            columns={2}
          />
        </NavigationMenuList>
      </NavigationMenu>

      {/* Game Day Mode prominent link */}
      <GameDayButton />
    </div>
  );
};

export default MainNavigation;
