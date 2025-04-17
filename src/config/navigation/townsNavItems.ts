
import { Building, MapPin, Search, Eye } from "lucide-react";
import type { NavItem } from './types';

export const townsNavItems: NavItem[] = [
  {
    title: "All Towns",
    path: "/towns",
    icon: Building,
    description: "Browse all towns"
  },
  {
    title: "Featured Towns",
    path: "/towns/featured",
    icon: MapPin,
    description: "View featured towns",
    highlight: true
  },
  {
    title: "Search Towns",
    path: "/towns/search",
    icon: Search,
    description: "Find specific towns"
  },
  {
    title: "Explore",
    path: "/towns/explore",
    icon: Eye,
    description: "Explore towns"
  }
];
