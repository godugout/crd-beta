
import { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  label: string;
  path: string;
  icon?: React.ElementType;
  description?: string;
  highlight?: boolean;
  title?: string; // Added for compatibility with navigation components
};
