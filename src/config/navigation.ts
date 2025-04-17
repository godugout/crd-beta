
import { 
  FolderOpen, 
  GalleryHorizontal, 
  History, 
  Star, 
  Calendar, 
  UserCircle, 
  Home,
  Layout,
  Gem,
  PenLine
} from 'lucide-react';

// Re-export all navigation items from their respective files
export * from './navigation/types';
export * from './navigation/mainNavItems';
export * from './navigation/cardsNavItems';
export * from './navigation/collectionsNavItems';
export * from './navigation/featuresNavItems';
export * from './navigation/baseballNavItems';
export * from './navigation/townsNavItems';
export * from './navigation/teamsNavItems';

export const mainNavItems = [
  {
    title: 'Home',
    path: '/',
    icon: Home
  },
  {
    title: 'Gallery',
    path: '/gallery',
    icon: GalleryHorizontal
  },
  {
    title: 'Collections',
    path: '/collections',
    icon: FolderOpen
  },
  {
    title: 'Create',
    path: '/create',
    icon: PenLine
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: UserCircle
  }
];

export const collectionsNavItems = [
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

export const galleryNavItems = [
  {
    title: 'All Cards',
    path: '/gallery',
    icon: Layout
  },
  {
    title: 'Recent',
    path: '/gallery/recent',
    icon: History
  },
  {
    title: 'Popular',
    path: '/gallery/popular',
    icon: Star
  },
  {
    title: 'Premium',
    path: '/gallery/premium',
    icon: Gem
  },
  {
    title: 'Events',
    path: '/gallery/events',
    icon: Calendar
  }
];

export const profileNavItems = [
  {
    title: 'Profile',
    path: '/profile',
    description: 'Manage your profile information'
  },
  {
    title: 'My Cards',
    path: '/profile/cards',
    description: 'View your created and collected cards'
  },
  {
    title: 'My Collections',
    path: '/profile/collections',
    description: 'Manage your collections'
  },
  {
    title: 'Settings',
    path: '/profile/settings',
    description: 'Update your account settings'
  }
];

export const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Discord', href: 'https://discord.gg/cardshow' },
      { label: 'Twitter', href: 'https://twitter.com/cardshow' },
      { label: 'Instagram', href: 'https://instagram.com/cardshow' },
      { label: 'YouTube', href: 'https://youtube.com/cardshow' }
    ]
  }
];
