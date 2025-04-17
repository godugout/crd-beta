
import { Library, FolderPlus, CircleUser, Search } from "lucide-react";
import { NavItem } from './types';

export const collectionsNavItems: NavItem[] = [
  {
    title: "All Collections",
    path: "/collections",
    icon: Library,
    description: "Browse all collections"
  },
  {
    title: "Create Collection",
    path: "/collections/create",
    icon: FolderPlus,
    description: "Create a new collection",
    highlight: true
  },
  {
    title: "My Collections",
    path: "/collections/my",
    icon: CircleUser,
    description: "View your collections"
  },
  {
    title: "Search Collections",
    path: "/collections/search",
    icon: Search,
    description: "Find specific collections"
  }
];
