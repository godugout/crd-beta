
import { Home, GalleryHorizontal, FolderOpen, PenLine, UserCircle } from "lucide-react";
import type { NavItem } from './types';

export const mainNavItems: NavItem[] = [
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
