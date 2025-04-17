
import { Home, Map, Calendar, Building } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
}

export const townsNavItems: NavItem[] = [
  {
    title: "Town Overview",
    path: "/town",
    icon: Home,
    description: "Town information"
  },
  {
    title: "Map",
    path: "/town/map",
    icon: Map,
    description: "Town map and locations",
    highlight: true
  },
  {
    title: "Events",
    path: "/town/events",
    icon: Calendar,
    description: "Town events calendar"
  },
  {
    title: "Landmarks",
    path: "/town/landmarks",
    icon: Building,
    description: "Notable town landmarks"
  }
];
