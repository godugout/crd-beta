
import { Icon } from "lucide-react";
import { Sparkles, Wand, Palette, BoxSelect } from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: Icon;
  description?: string;
  highlight?: boolean;
}

export const featuresNavItems: NavItem[] = [
  {
    title: "All Features",
    path: "/features",
    icon: Sparkles,
    description: "Browse all features"
  },
  {
    title: "AI Tools",
    path: "/features/ai",
    icon: Wand,
    description: "AI-powered tools",
    highlight: true
  },
  {
    title: "Design Tools",
    path: "/features/design",
    icon: Palette,
    description: "Card design features"
  },
  {
    title: "Collections",
    path: "/features/collections",
    icon: BoxSelect,
    description: "Card collections"
  }
];
