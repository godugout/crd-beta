
import { NavigationItem } from './types';
import { Clock, Layers, Users, UserPlus, Settings, Briefcase } from 'lucide-react';

export const teamsNavItems: NavigationItem[] = [
  {
    title: 'My Teams',
    path: '/teams',
    icon: Users,
    description: 'Teams you belong to',
  },
  {
    title: 'Join Team',
    path: '/teams/join',
    icon: UserPlus,
    description: 'Join an existing team',
  },
  {
    title: 'Team Activity',
    path: '/teams/activity',
    icon: Clock,
    description: 'Recent team activity',
  },
  {
    title: 'Projects',
    path: '/teams/projects',
    icon: Briefcase,
    description: 'Team projects',
  },
  {
    title: 'Team Settings',
    path: '/teams/settings',
    icon: Settings,
    description: 'Manage team settings',
  },
];
