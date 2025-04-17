
import { Trophy, Medal, History, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
}

export const baseballNavItems: NavItem[] = [
  {
    title: "Teams",
    path: "/baseball/teams",
    icon: Trophy,
    description: "Baseball teams"
  },
  {
    title: "Players",
    path: "/baseball/players",
    icon: Medal,
    description: "Baseball players",
    highlight: true
  },
  {
    title: "History",
    path: "/baseball/history",
    icon: History,
    description: "Baseball history"
  },
  {
    title: "Collections",
    path: "/baseball/collections",
    icon: Layers,
    description: "Baseball card collections"
  }
];
