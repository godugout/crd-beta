
import { Team } from '@/lib/types/TeamTypes';
import React from 'react';

export interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactNode; 
  color?: string;
}

export interface BreadcrumbHandlerProps {
  index: number;
  pathSegments: string[];
  segment: string;
  currentPath: string;
  currentTeam?: Team | null;
}
