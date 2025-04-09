
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavigationSection from './components/NavigationSection';
import TeamNavigation from './components/TeamNavigation';
import GameDayButton from './components/GameDayButton';
import { cardsNavigation, collectionsNavigation, featuresNavigation } from './components/NavigationItems';

const MainNavigation: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  
  // Determine active section from URL
  const getActiveSection = () => {
    const pathParts = location.pathname.split('/');
    return pathParts.length > 1 ? pathParts[1] : '';
  };
  
  const activeSection = getActiveSection();
  
  // Hide desktop navigation on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Cards Navigation */}
          <NavigationSection 
            title={cardsNavigation.title}
            items={cardsNavigation.items}
            isActive={activeSection === cardsNavigation.key}
            layout={cardsNavigation.layout}
            columns={cardsNavigation.columns}
            featuredItem={cardsNavigation.featuredItem}
          />

          {/* Collections Navigation */}
          <NavigationSection 
            title={collectionsNavigation.title}
            items={collectionsNavigation.items}
            isActive={activeSection === collectionsNavigation.key}
            layout={collectionsNavigation.layout}
            featuredItem={collectionsNavigation.featuredItem}
          />

          {/* Teams Navigation - Custom component due to unique layout */}
          <TeamNavigation activeSection={activeSection} />

          {/* Features Navigation */}
          <NavigationSection 
            title={featuresNavigation.title}
            items={featuresNavigation.items}
            isActive={activeSection === featuresNavigation.key}
            layout={featuresNavigation.layout}
            columns={featuresNavigation.columns}
          />
        </NavigationMenuList>
      </NavigationMenu>

      {/* Game Day Mode prominent link */}
      <GameDayButton />
    </div>
  );
};

export default MainNavigation;
