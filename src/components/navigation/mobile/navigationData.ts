
import { NavigationGroup } from './types';
import { 
  mainNavItems, 
  cardsNavItems, 
  collectionsNavItems, 
  teamsNavItems,
  townsNavItems, 
  featuresNavItems,
  baseballNavItems
} from '@/config/navigation/index';

// Helper to ensure all required properties exist
const processNavItem = (item: any) => ({
  title: item.title,
  path: item.path,
  icon: item.icon,
  highlight: item.highlight || false,
  description: item.description || ''
});

// Define navigation groups for better organization with consistent paths
export const navigationGroups: NavigationGroup[] = [
  {
    title: "MAIN",
    items: mainNavItems.map(processNavItem)
  },
  {
    title: "CARDS",
    items: cardsNavItems.map(processNavItem)
  },
  {
    title: "COLLECTIONS",
    items: collectionsNavItems.map(processNavItem)
  },
  {
    title: "TOWNS",
    items: townsNavItems.map(processNavItem)
  },
  {
    title: "TEAMS",
    items: teamsNavItems.map(processNavItem)
  },
  {
    title: "FEATURES",
    items: featuresNavItems.map(processNavItem)
  },
  {
    title: "BASEBALL",
    items: baseballNavItems.map(processNavItem)
  }
];
