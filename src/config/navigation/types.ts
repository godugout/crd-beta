
import { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  label: string;
  path: string;
  icon: React.ElementType;  // Changed from optional to required
  description?: string;
  highlight?: boolean;
  title?: string; // Added for compatibility with navigation components
};
