
import { Archive, Compass, Grid, Layers, Lightbulb, Microscope, Palette, Smartphone } from 'lucide-react';
import { NavigationItem } from './types';

export const featuresNavItems: NavigationItem[] = [
  {
    title: "Cards",
    path: "/cards",
    icon: Grid,
    description: "Browse your card collection"
  },
  {
    title: "Collections", 
    path: "/collections",
    icon: Archive,
    description: "Manage your card collections"
  },
  {
    title: "Create",
    path: "/create",
    icon: Layers,
    description: "Create new cards"
  },
  {
    title: "Card Effects",
    path: "/effects",
    icon: Palette,
    description: "Explore card visual effects"
  },
  {
    title: "AR Experience",
    path: "/ar",
    icon: Smartphone,
    description: "Experience cards in augmented reality"
  },
  {
    title: "Discover",
    path: "/discover",
    icon: Compass,
    description: "Discover new cards and collections"
  },
  {
    title: "Labs",
    path: "/labs",
    icon: Microscope,
    description: "Experimental features",
    subItems: [
      {
        title: "PBR Demo",
        path: "/labs/pbr",
        icon: Lightbulb,
        description: "Physically Based Rendering demonstration"
      },
      {
        title: "Baseball Cards",
        path: "/labs/baseball",
        icon: Lightbulb,
        description: "Baseball card experience"
      }
    ]
  }
];
