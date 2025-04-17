
import { ReactElement } from 'react';

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ElementType;
  highlight?: boolean;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
