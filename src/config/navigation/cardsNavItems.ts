
import { Grid, Pencil, Star, Cards } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
  label?: string; // For backwards compatibility
}

export const cardsNavItems: NavItem[] = [
  {
    title: "All Cards",
    label: "All Cards", // For backwards compatibility
    path: "/cards",
    icon: Grid,
    description: "Browse all cards"
  },
  {
    title: "Create Card",
    label: "Create Card", // For backwards compatibility
    path: "/cards/create",
    icon: Pencil,
    description: "Create a new card",
    highlight: true
  },
  {
    title: "Collections",
    label: "Collections", // For backwards compatibility
    path: "/collections",
    icon: Cards,
    description: "View card collections"
  },
  {
    title: "Favorites",
    label: "Favorites", // For backwards compatibility
    path: "/cards/favorites",
    icon: Star,
    description: "Your favorite cards"
  }
];
