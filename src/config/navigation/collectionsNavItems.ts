
import { LibraryBig, FolderPlus, Star, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  highlight?: boolean;
}

export const collectionsNavItems: NavItem[] = [
  {
    title: "All Collections",
    path: "/collections",
    icon: LibraryBig,
    description: "Browse all collections"
  },
  {
    title: "My Collections",
    path: "/collections/my",
    icon: Star,
    description: "View your personal collections",
    highlight: true
  },
  {
    title: "Create Collection",
    path: "/collections/create",
    icon: FolderPlus,
    description: "Create a new collection"
  },
  {
    title: "Categories",
    path: "/collections/categories",
    icon: Tag,
    description: "Browse by category"
  }
];
