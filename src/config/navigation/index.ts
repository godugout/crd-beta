
// Export the interfaces from a single source
export { type NavItem, type NavGroup } from './types';

// Import and re-export all navigation items centrally
import { mainNavItems } from './mainNavItems';
import { cardsNavItems } from './cardsNavItems';
import { collectionsNavItems } from './collectionsNavItems';
import { featuresNavItems } from './featuresNavItems';
import { baseballNavItems } from './baseballNavItems';
import { townsNavItems } from './townsNavItems';
import { teamsNavItems } from './teamsNavItems';

export {
  mainNavItems,
  cardsNavItems,
  collectionsNavItems,
  featuresNavItems,
  baseballNavItems,
  townsNavItems,
  teamsNavItems
};
