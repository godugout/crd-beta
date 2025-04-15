
import { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  description?: string;
  highlight?: boolean;
  label?: string; // Added for backward compatibility
};
