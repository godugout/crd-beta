
import { Shirt, PlusCircle, Search, ListFilter } from "lucide-react";
import { NavItem } from './types';

export const baseballNavItems: NavItem[] = [
  {
    title: "All Cards",
    path: "/baseball",
    icon: Shirt, // Replace Baseball with Shirt since Baseball doesn't exist
    description: "Browse all baseball cards"
  },
  {
    title: "Create Card",
    path: "/baseball/create",
    icon: PlusCircle,
    description: "Create a new baseball card",
    highlight: true
  },
  {
    title: "Search",
    path: "/baseball/search",
    icon: Search,
    description: "Search baseball cards"
  },
  {
    title: "Collections",
    path: "/baseball/collections",
    icon: ListFilter,
    description: "View baseball card collections"
  }
];
