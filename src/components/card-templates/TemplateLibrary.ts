
import { CardTemplate } from "@/lib/types/templateTypes";
import { MarketMetadata } from "@/lib/types/cardTypes";

// Default market metadata object that matches the required interface
const defaultMarketMetadata: MarketMetadata = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
  price: 0,
  currency: 'USD',
  availableForSale: false,
  editionSize: 1,
  editionNumber: 1
};

// Sample templates for development
const templates: CardTemplate[] = [
  {
    id: "classic-baseball",
    name: "Classic Baseball",
    description: "Traditional baseball card design with clean lines and borders",
    thumbnail: "/templates/classic-baseball.jpg",
    category: "sports",
    tags: ["baseball", "classic", "traditional"],
    popularity: 85,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: "classic",
        effect: "none",
        borderRadius: "8px",
        borderColor: "#000000",
        shadowColor: "rgba(0,0,0,0.2)",
        frameWidth: 4,
        frameColor: "#e0e0e0"
      },
      textStyle: {
        fontFamily: "Inter",
        titleColor: "#000000",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#333333"
      },
      effects: []
    },
    cardStyle: {
      template: "classic",
      effect: "none",
      borderRadius: "8px",
      borderColor: "#000000",
      shadowColor: "rgba(0,0,0,0.2)",
      frameWidth: 4,
      frameColor: "#e0e0e0"
    },
    marketMetadata: defaultMarketMetadata
  },
  {
    id: "modern-premium",
    name: "Modern Premium",
    description: "Sleek modern design with premium finishes and effects",
    thumbnail: "/templates/modern-premium.jpg",
    category: "premium",
    tags: ["premium", "modern", "luxury"],
    popularity: 92,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: "modern",
        effect: "chrome",
        borderRadius: "16px",
        borderColor: "#1a1a1a",
        shadowColor: "rgba(0,0,0,0.4)",
        frameWidth: 2,
        frameColor: "#888888"
      },
      textStyle: {
        fontFamily: "Helvetica",
        titleColor: "#ffffff",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#cccccc"
      },
      effects: ["holographic"]
    },
    cardStyle: {
      template: "modern",
      effect: "chrome",
      borderRadius: "16px",
      borderColor: "#1a1a1a",
      shadowColor: "rgba(0,0,0,0.4)",
      frameWidth: 2,
      frameColor: "#888888"
    },
    marketMetadata: defaultMarketMetadata
  },
  {
    id: "vintage-throwback",
    name: "Vintage Throwback",
    description: "Nostalgic design reminiscent of classic trading cards from the past",
    thumbnail: "/templates/vintage-throwback.jpg",
    category: "retro",
    tags: ["vintage", "retro", "throwback"],
    popularity: 78,
    isOfficial: true,
    designDefaults: {
      cardStyle: {
        template: "vintage",
        effect: "vintage",
        borderRadius: "4px",
        borderColor: "#d8c9a3",
        shadowColor: "rgba(139,69,19,0.3)",
        frameWidth: 6,
        frameColor: "#d8c9a3"
      },
      textStyle: {
        fontFamily: "Georgia",
        titleColor: "#5a3921",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#6b5b4c"
      },
      effects: ["vintage"]
    },
    cardStyle: {
      template: "vintage",
      effect: "vintage",
      borderRadius: "4px",
      borderColor: "#d8c9a3",
      shadowColor: "rgba(139,69,19,0.3)",
      frameWidth: 6,
      frameColor: "#d8c9a3"
    },
    marketMetadata: defaultMarketMetadata
  }
];

class TemplateLibrary {
  private templates: CardTemplate[] = templates;

  getAllTemplates(): CardTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): CardTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  getTemplatesByCategory(category: string): CardTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  getFeaturedTemplates(limit: number = 5): CardTemplate[] {
    return [...this.templates]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  }

  searchTemplates(query: string): CardTemplate[] {
    const searchTerm = query.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(searchTerm) || 
      template.description?.toLowerCase().includes(searchTerm) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  addTemplate(template: CardTemplate): CardTemplate {
    // In a real app, we'd probably call an API here
    this.templates.push(template);
    return template;
  }
}

export const templateLibrary = new TemplateLibrary();
export default templateLibrary;
