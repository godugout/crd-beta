
import { Users, UserCircle, Settings, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
}

export const teamsNavItems: NavItem[] = [
  {
    title: "Teams",
    path: "/teams",
    icon: Users,
    description: "Browse all teams"
  },
  {
    title: "My Team",
    path: "/teams/my-team",
    icon: UserCircle,
    description: "View your team",
    highlight: true
  },
  {
    title: "Team Settings",
    path: "/teams/settings",
    icon: Settings,
    description: "Manage team settings"
  },
  {
    title: "Team Chat",
    path: "/teams/chat",
    icon: MessageCircle,
    description: "Team communication"
  }
];
