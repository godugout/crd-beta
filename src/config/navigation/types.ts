
import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
  label?: string;  // Including the label property
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
