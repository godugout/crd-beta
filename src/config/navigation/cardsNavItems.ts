
import { Grid, LibraryBig, PlusCircle, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
}

export const cardsNavItems: NavItem[] = [
  {
    title: "All Cards",
    path: "/cards",
    icon: Grid,
    description: "Browse all cards"
  },
  {
    title: "My Collection",
    path: "/cards/collection",
    icon: LibraryBig,
    description: "View your personal collection",
    highlight: true
  },
  {
    title: "Create Card",
    path: "/cards/create",
    icon: PlusCircle,
    description: "Design a new card"
  },
  {
    title: "Search",
    path: "/cards/search",
    icon: Search,
    description: "Find specific cards"
  }
];
