
import { ReactElement } from 'react';

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ElementType;
  highlight?: boolean;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
