
import { Sparkles, Star, Lightbulb, Layers } from "lucide-react";
import type { NavItem } from './types';

export const featuresNavItems: NavItem[] = [
  {
    title: "All Features",
    path: "/features",
    icon: Sparkles,
    description: "Browse all features"
  },
  {
    title: "Popular",
    path: "/features/popular",
    icon: Star,
    description: "Most popular features",
    highlight: true
  },
  {
    title: "New",
    path: "/features/new",
    icon: Lightbulb,
    description: "Latest features"
  },
  {
    title: "Categories",
    path: "/features/categories",
    icon: Layers,
    description: "Browse by category"
  }
];
