
import { Icon } from "lucide-react";
import { Trophy, Users, Calendar, BarChart } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: Icon;
  description?: string;
  highlight?: boolean;
}

export const baseballNavItems: NavItem[] = [
  {
    title: "Games",
    path: "/baseball/games",
    icon: Trophy,
    description: "View upcoming and past games"
  },
  {
    title: "Teams",
    path: "/baseball/teams",
    icon: Users,
    description: "Browse baseball teams",
    highlight: true
  },
  {
    title: "Schedule",
    path: "/baseball/schedule",
    icon: Calendar,
    description: "Season schedule"
  },
  {
    title: "Stats",
    path: "/baseball/stats",
    icon: BarChart,
    description: "Player and team statistics"
  }
];
