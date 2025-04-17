
import { Home, Layers, Bell, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
  label?: string;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: Home,
    description: "Dashboard and recent activity"
  },
  {
    title: "Explore",
    path: "/explore",
    icon: Layers,
    description: "Discover new content",
    highlight: true,
    label: "Explore"
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
    description: "Your notifications"
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    description: "App settings"
  }
];
