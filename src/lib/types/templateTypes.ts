
export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: CardTemplate[];
}

// Use export type for isolatedModules compatibility
export type { CardTemplate as CardTemplateType, TemplateCategory as TemplateCategoryType };
