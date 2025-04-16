
import { BaseEntity } from '@/lib/types';
import { Team } from '@/lib/types/teamTypes'; // Consistent casing

export interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  parentId?: string;
  isActive?: boolean;
  color?: string; // Added color property
}

export interface BreadcrumbHandlerProps {
  index: number;
  pathSegments: string[];
  segment: string;
  currentPath: string;
  currentTeam?: Team | null;
}
