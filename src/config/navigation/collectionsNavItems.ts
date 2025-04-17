
import { FolderOpen, UserCircle, Star, History } from "lucide-react";
import type { NavItem } from './types';

export const collectionsNavItems: NavItem[] = [
  {
    title: 'All',
    path: '/collections',
    icon: FolderOpen,
    description: 'All collections'
  },
  {
    title: 'My Collections',
    path: '/collections/my',
    icon: UserCircle,
    description: 'Collections created by you'
  },
  {
    title: 'Featured',
    path: '/collections/featured',
    icon: Star,
    description: 'Featured collections'
  },
  {
    title: 'Recent',
    path: '/collections/recent',
    icon: History,
    description: 'Recently created collections'
  }
];
