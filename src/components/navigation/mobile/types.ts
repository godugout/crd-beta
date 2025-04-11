
import { ReactElement } from 'react';

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ElementType;
  highlight?: boolean;
  label?: string; // Add label as an optional property to maintain compatibility
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
