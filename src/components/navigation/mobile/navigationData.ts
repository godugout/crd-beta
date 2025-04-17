
import { NavigationGroup } from './types';
import { 
  mainNavItems, 
  cardsNavItems, 
  collectionsNavItems, 
  teamsNavItems,
  townsNavItems, 
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
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "CARDS",
    items: cardsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "COLLECTIONS",
    items: collectionsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "TOWNS",
    items: townsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "TEAMS",
    items: teamsNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "FEATURES",
    items: featuresNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  },
  {
    title: "BASEBALL",
    items: baseballNavItems.map(item => ({
      title: item.title,
      path: item.path,
      icon: item.icon,
      highlight: item.highlight || false,
      description: item.description || ''
    }))
  }
];
