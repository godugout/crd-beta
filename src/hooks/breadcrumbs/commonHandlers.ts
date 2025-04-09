
import React from 'react';
import { BreadcrumbHandlerProps, BreadcrumbItem } from './types';
import { Home, Users } from 'lucide-react';

// Base helper to create a home breadcrumb
export const createHomeBreadcrumb = (): BreadcrumbItem => ({
  path: '/', 
  label: 'Home', 
  icon: <Home className="h-3.5 w-3.5" /> 
});

// Helper for teams breadcrumb
export const createTeamsBreadcrumb = (): BreadcrumbItem => ({
  path: '/teams',
  label: 'Teams',
  icon: <Users className="h-3.5 w-3.5" />
});

// Helper for generating generic breadcrumb item
export const createGenericBreadcrumb = (segment: string, currentPath: string): BreadcrumbItem => {
  const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  return {
    path: currentPath,
    label: label
  };
};
