
import { LibraryBig, Heart, PlusCircle, Search } from "lucide-react";
import { NavItem } from './types';

export const cardsNavItems: NavItem[] = [
  {
    title: "All Cards",
    path: "/cards",
    icon: LibraryBig,
    description: "Browse all cards"
  },
  {
    title: "My Cards",
    path: "/cards/my",
    icon: Heart,
    description: "View your cards",
    highlight: true
  },
  {
    title: "Create Card",
    path: "/cards/create",
    icon: PlusCircle,
    description: "Create a new card"
  },
  {
    title: "Search Cards",
    path: "/cards/search",
    icon: Search,
    description: "Find specific cards"
  }
];
