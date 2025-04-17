
import { Map, Home, PlusCircle, Search } from "lucide-react";
import type { NavItem } from './types';

export const townsNavItems: NavItem[] = [
  {
    title: "All Towns",
    path: "/towns",
    icon: Map,
    description: "Browse all towns"
  },
  {
    title: "My Town",
    path: "/towns/my",
    icon: Home,
    description: "View your town",
    highlight: true
  },
  {
    title: "Create Town",
    path: "/towns/create",
    icon: PlusCircle,
    description: "Create a new town"
  },
  {
    title: "Search Towns",
    path: "/towns/search",
    icon: Search,
    description: "Find specific towns"
  }
];
