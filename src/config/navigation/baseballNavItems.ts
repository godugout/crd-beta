
import { Baseline, Trophy, Calendar, User, Star } from "lucide-react";
import type { NavItem } from './types';

export const baseballNavItems: NavItem[] = [
  {
    title: "Teams",
    path: "/baseball/teams",
    icon: Baseline,
    description: "Browse baseball teams"
  },
  {
    title: "Players",
    path: "/baseball/players",
    icon: User,
    description: "Browse baseball players"
  },
  {
    title: "Games",
    path: "/baseball/games",
    icon: Calendar,
    description: "Game schedule"
  },
  {
    title: "Championships",
    path: "/baseball/championships",
    icon: Trophy,
    description: "Championship history"
  },
  {
    title: "Hall of Fame",
    path: "/baseball/hall-of-fame",
    icon: Star,
    description: "Hall of Fame members",
    highlight: true
  }
];
