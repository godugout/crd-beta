
import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
  highlight?: boolean;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
