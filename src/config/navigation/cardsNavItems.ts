
import { Grid, Star, Clock, Search, PlusCircle } from "lucide-react";
import type { NavItem } from './types';

export const cardsNavItems: NavItem[] = [
  {
    title: "All Cards",
    path: "/cards",
    icon: Grid,
    description: "Browse all cards"
  },
  {
    title: "Featured Cards",
    path: "/cards/featured",
    icon: Star,
    description: "View featured cards"
  },
  {
    title: "Recent Cards",
    path: "/cards/recent",
    icon: Clock,
    description: "Recently added cards"
  },
  {
    title: "Create Card",
    path: "/cards/create",
    icon: PlusCircle,
    description: "Create a new card",
    highlight: true
  },
  {
    title: "Search Cards",
    path: "/cards/search",
    icon: Search,
    description: "Search for cards"
  }
];
