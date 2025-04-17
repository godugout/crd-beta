
import { Sparkles, Calendar, Users, Camera } from "lucide-react";
import type { NavItem } from './types';

export const featuresNavItems: NavItem[] = [
  {
    title: "Game Day Mode",
    path: "/features/gameday",
    icon: Calendar,
    description: "Enhanced stadium experience",
    highlight: true
  },
  {
    title: "Group Memory",
    path: "/group-memory-creator",
    icon: Users,
    description: "Create group memories"
  },
  {
    title: "Card Detection",
    path: "/detector",
    icon: Camera,
    description: "Scan physical cards"
  },
  {
    title: "Labs",
    path: "/features/labs",
    icon: Sparkles,
    description: "Experimental features"
  }
];
