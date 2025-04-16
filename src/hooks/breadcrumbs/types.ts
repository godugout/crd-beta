import { BaseEntity } from '@/lib/types';
import { Team } from '@/lib/types/teamTypes'; // Correct casing

export interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  parentId?: string;
  isActive?: boolean;
}
