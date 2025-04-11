
import { NavigationGroup } from './types';
import { 
  mainNavItems, 
  cardsNavItems, 
  collectionsNavItems, 
  teamsNavItems, 
  featuresNavItems,
  baseballNavItems
} from '@/config/navigation';

// Define navigation groups for better organization with consistent paths
export const navigationGroups: NavigationGroup[] = [
  {
    title: "MAIN",
    items: mainNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  },
  {
    title: "CARDS",
    items: cardsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  },
  {
    title: "COLLECTIONS",
    items: collectionsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  },
  {
    title: "TEAMS",
    items: teamsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  },
  {
    title: "FEATURES",
    items: featuresNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  },
  {
    title: "BASEBALL",
    items: baseballNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight
    }))
  }
];
