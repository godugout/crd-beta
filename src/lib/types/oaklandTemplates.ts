
export interface OaklandTemplate {
  id: string;
  name: string;
  description: string;
  category: 'nostalgia' | 'celebration' | 'protest' | 'community';
  subcategory?: string;
  thumbnailUrl: string;
  previewUrl?: string;
  completionPercentage: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isNew: boolean;
  isTrending: boolean;
  isFavorite: boolean;
  usageCount: number;
  lastUsed?: Date;
  metadata: {
    era?: '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';
    theme: string[];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    features: string[];
    estimatedTime: number; // minutes
  };
  effects: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  isPopular: boolean;
}

export interface TemplateFilter {
  category?: string;
  era?: string;
  difficulty?: string;
  searchQuery?: string;
  showFavorites?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  templates: OaklandTemplate[];
  priority: number;
}
