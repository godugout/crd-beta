
import React from 'react';
import { BreadcrumbItem, BreadcrumbHandlerProps } from './types';
import { Home, Users } from 'lucide-react';

// Base helper to create a home breadcrumb
export const createHomeBreadcrumb = (): BreadcrumbItem => ({
  id: 'home',
  path: '/', 
  label: 'Home', 
  icon: React.createElement(Home, { className: "h-3.5 w-3.5" }) 
});

// Helper for teams breadcrumb
export const createTeamsBreadcrumb = (): BreadcrumbItem => ({
  id: 'teams',
  path: '/teams',
  label: 'Teams',
  icon: React.createElement(Users, { className: "h-3.5 w-3.5" })
});

// Helper for generating generic breadcrumb item
export const createGenericBreadcrumb = (segment: string, currentPath: string): BreadcrumbItem => {
  const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  return {
    id: `generic-${currentPath}`,
    path: currentPath,
    label: label
  };
};
