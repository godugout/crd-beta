
import { Group, Users, PlusCircle, Search } from "lucide-react";
import type { NavItem } from './types';

export const teamsNavItems: NavItem[] = [
  {
    title: "All Teams",
    path: "/teams",
    icon: Group,
    description: "Browse all teams",
    label: "All Teams"
  },
  {
    title: "My Teams",
    path: "/teams/my",
    icon: Users,
    description: "View your teams",
    highlight: true,
    label: "My Teams"
  },
  {
    title: "Create Team",
    path: "/teams/create",
    icon: PlusCircle,
    description: "Create a new team",
    label: "Create Team"
  },
  {
    title: "Search Teams",
    path: "/teams/search",
    icon: Search,
    description: "Find specific teams",
    label: "Search Teams"
  }
];
