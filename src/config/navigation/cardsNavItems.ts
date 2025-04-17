
import { Icon } from "lucide-react";
import { Grid, Heart, BookOpen, Plus, Star } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: Icon;
  description?: string;
  highlight?: boolean;
  label?: string;  // Added this for compatibility
}

export const cardsNavItems: NavItem[] = [
  {
    title: "All Cards",
    path: "/cards",
    icon: Grid,
    description: "Browse all cards",
    label: "All Cards"
  },
  {
    title: "Favorites",
    path: "/cards/favorites",
    icon: Heart,
    description: "View your favorite cards",
    label: "Favorites"
  },
  {
    title: "Collections",
    path: "/collections",
    icon: BookOpen,
    description: "Explore card collections",
    label: "Collections"
  },
  {
    title: "Create Card",
    path: "/cards/create",
    icon: Plus,
    description: "Design a new card",
    highlight: true,
    label: "Create"
  },
  {
    title: "Featured",
    path: "/cards/featured",
    icon: Star,
    description: "Highlighted special cards",
    label: "Featured"
  }
];
