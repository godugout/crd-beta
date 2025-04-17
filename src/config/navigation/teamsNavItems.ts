
import { Group, Users, PlusCircle, Search } from "lucide-react";
import type { NavItem } from './types';

export const teamsNavItems: NavItem[] = [
  {
    title: "All Teams",
    path: "/teams",
    icon: Group,
    description: "Browse all teams"
  },
  {
    title: "My Teams",
    path: "/teams/my",
    icon: Users,
    description: "View your teams",
    highlight: true
  },
  {
    title: "Create Team",
    path: "/teams/create",
    icon: PlusCircle,
    description: "Create a new team"
  },
  {
    title: "Search Teams",
    path: "/teams/search",
    icon: Search,
    description: "Find specific teams"
  }
];
