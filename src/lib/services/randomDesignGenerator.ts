
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { OAKLAND_TEMPLATES } from '@/lib/data/oaklandTemplateData';

interface RandomDesignOptions {
  baseTemplate?: OaklandTemplate;
  colorVariation?: number; // 0-1, how much to vary colors
  effectIntensity?: number; // 0-1, how intense effects should be
  decorativeElements?: number; // 0-1, how many decorative elements to add
}

interface GeneratedDesign {
  template: OaklandTemplate;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  effects: string[];
  svgOverlays: SVGOverlay[];
  canvasEffects: CanvasEffect[];
  metadata: {
    seed: number;
    timestamp: Date;
    inspiration: string;
  };
}

interface SVGOverlay {
  id: string;
  type: 'pattern' | 'border' | 'icon' | 'texture';
  svgPath: string;
  position: { x: number; y: number };
  scale: number;
  opacity: number;
  color: string;
}

interface CanvasEffect {
  id: string;
  type: 'noise' | 'gradient' | 'texture' | 'vintage';
  settings: Record<string, any>;
  blendMode: string;
  opacity: number;
}

// Oakland A's color variations
const OAKLAND_COLOR_PALETTES = [
  {
    name: 'Classic Green & Gold',
    primary: '#003831',
    secondary: '#EFB21E',
    accent: '#FFFFFF',
    variations: ['#004d3f', '#2d5a4f', '#1a3d36', '#ffcc4d', '#d4a017', '#b8860b']
  },
  {
    name: 'Vintage Sepia',
    primary: '#4a3c28',
    secondary: '#d4a574',
    accent: '#f4f1e8',
    variations: ['#5d4e35', '#6b5b42', '#3d321f', '#e6c799', '#c4956b', '#a67c52']
  },
  {
    name: 'Protest Red',
    primary: '#DC2626',
    secondary: '#EFB21E',
    accent: '#000000',
    variations: ['#b91c1c', '#991b1b', '#7f1d1d', '#fbbf24', '#f59e0b', '#d97706']
  },
  {
    name: 'Coliseum Concrete',
    primary: '#6b7280',
    secondary: '#EFB21E',
    accent: '#f3f4f6',
    variations: ['#4b5563', '#374151', '#1f2937', '#fcd34d', '#f59e0b', '#d97706']
  },
  {
    name: 'Rally Possum',
    primary: '#8b5a3c',
    secondary: '#f4e7d1',
    accent: '#2d1810',
    variations: ['#a0694f', '#6d4428', '#593015', '#f9f1e6', '#e8d2b3', '#d4b896']
  }
];

// SVG pattern templates
const SVG_PATTERNS = {
  baseballStitch: `<path d="M10,5 Q15,10 10,15 Q5,10 10,5" stroke="currentColor" fill="none" stroke-width="2"/>`,
  oaklandBridge: `<path d="M0,15 L5,5 L10,15 L15,5 L20,15" stroke="currentColor" fill="none" stroke-width="2"/>`,
  diamondPattern: `<polygon points="10,2 18,10 10,18 2,10" fill="currentColor" opacity="0.3"/>`,
  vintageFrame: `<rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>`,
  elephantSilhouette: `<path d="M5,15 Q3,12 5,10 Q8,8 12,10 Q15,8 18,10 Q20,12 18,15 Q16,17 12,15 Q8,17 5,15" fill="currentColor"/>`,
  baseballSeams: `<ellipse cx="10" cy="10" rx="8" ry="12" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>`
};

class RandomDesignGenerator {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Math.floor(Math.random() * 1000000);
  }

  // Seeded random number generator for consistent results
  private random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  private pickRandom<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  private generateColorScheme(): GeneratedDesign['colorScheme'] {
    const basePalette = this.pickRandom(OAKLAND_COLOR_PALETTES);
    const variation = this.pickRandom(basePalette.variations);
    
    return {
      primary: basePalette.primary,
      secondary: basePalette.secondary,
      accent: basePalette.accent,
      background: variation
    };
  }

  private generateSVGOverlays(): SVGOverlay[] {
    const overlays: SVGOverlay[] = [];
    const numOverlays = Math.floor(this.random() * 3) + 1; // 1-3 overlays
    
    for (let i = 0; i < numOverlays; i++) {
      const patternKey = this.pickRandom(Object.keys(SVG_PATTERNS));
      const pattern = SVG_PATTERNS[patternKey as keyof typeof SVG_PATTERNS];
      
      overlays.push({
        id: `svg-${i}-${Date.now()}`,
        type: this.pickRandom(['pattern', 'border', 'icon']),
        svgPath: pattern,
        position: {
          x: this.random() * 0.8 + 0.1, // 10%-90% of card width
          y: this.random() * 0.8 + 0.1  // 10%-90% of card height
        },
        scale: this.random() * 0.5 + 0.5, // 50%-100% scale
        opacity: this.random() * 0.4 + 0.1, // 10%-50% opacity
        color: this.pickRandom(['#003831', '#EFB21E', '#FFFFFF', '#DC2626'])
      });
    }
    
    return overlays;
  }

  private generateCanvasEffects(): CanvasEffect[] {
    const effects: CanvasEffect[] = [];
    const numEffects = Math.floor(this.random() * 2) + 1; // 1-2 effects
    
    const effectTypes = ['noise', 'gradient', 'texture', 'vintage'];
    
    for (let i = 0; i < numEffects; i++) {
      const type = this.pickRandom(effectTypes);
      
      effects.push({
        id: `canvas-${i}-${Date.now()}`,
        type: type as any,
        settings: this.generateEffectSettings(type),
        blendMode: this.pickRandom(['multiply', 'overlay', 'soft-light', 'color-burn']),
        opacity: this.random() * 0.3 + 0.1 // 10%-40% opacity
      });
    }
    
    return effects;
  }

  private generateEffectSettings(type: string): Record<string, any> {
    switch (type) {
      case 'noise':
        return {
          intensity: this.random() * 0.5 + 0.2,
          scale: this.random() * 2 + 1,
          monochrome: this.random() > 0.5
        };
      case 'gradient':
        return {
          direction: this.random() * 360,
          stops: [
            { color: '#003831', position: this.random() * 0.3 },
            { color: '#EFB21E', position: this.random() * 0.4 + 0.3 },
            { color: '#FFFFFF', position: this.random() * 0.3 + 0.7 }
          ]
        };
      case 'texture':
        return {
          pattern: this.pickRandom(['paper', 'fabric', 'metal', 'leather']),
          scale: this.random() * 2 + 0.5,
          roughness: this.random() * 0.8 + 0.2
        };
      case 'vintage':
        return {
          scratches: this.random() > 0.6,
          dusty: this.random() > 0.4,
          faded: this.random() * 0.3 + 0.1,
          sepia: this.random() * 0.4 + 0.1
        };
      default:
        return {};
    }
  }

  private generateRandomEffects(): string[] {
    const availableEffects = ['vintage-sepia', 'gold-foil', 'holographic', 'chrome', 'dusty-glow'];
    const numEffects = Math.floor(this.random() * 3) + 1; // 1-3 effects
    const selectedEffects: string[] = [];
    
    for (let i = 0; i < numEffects; i++) {
      const effect = this.pickRandom(availableEffects);
      if (!selectedEffects.includes(effect)) {
        selectedEffects.push(effect);
      }
    }
    
    return selectedEffects;
  }

  generateRandomDesign(options: RandomDesignOptions = {}): GeneratedDesign {
    // Select base template
    const baseTemplate = options.baseTemplate || this.pickRandom(OAKLAND_TEMPLATES);
    
    // Generate variations
    const colorScheme = this.generateColorScheme();
    const effects = this.generateRandomEffects();
    const svgOverlays = this.generateSVGOverlays();
    const canvasEffects = this.generateCanvasEffects();
    
    // Create inspirational message
    const inspirations = [
      "Inspired by the roar of the Coliseum crowd",
      "Channeling the spirit of Rickey Henderson",
      "A tribute to 50+ years in Oakland",
      "Capturing the essence of Rally Possum magic",
      "Honoring the Bash Brothers era",
      "Reflecting the fight for Oakland baseball",
      "Celebrating the stompin' A's tradition",
      "Embodying the Earthquake Series spirit"
    ];
    
    return {
      template: {
        ...baseTemplate,
        id: `lucky-${this.seed}-${Date.now()}`,
        name: `Lucky Design ${Math.floor(this.random() * 1000)}`,
        metadata: {
          ...baseTemplate.metadata,
          colors: colorScheme
        }
      },
      colorScheme,
      effects,
      svgOverlays,
      canvasEffects,
      metadata: {
        seed: this.seed,
        timestamp: new Date(),
        inspiration: this.pickRandom(inspirations)
      }
    };
  }

  // Generate multiple designs for comparison
  generateDesignBatch(count: number = 3): GeneratedDesign[] {
    const designs: GeneratedDesign[] = [];
    
    for (let i = 0; i < count; i++) {
      // Use different seeds for variety
      this.seed = Math.floor(Math.random() * 1000000);
      designs.push(this.generateRandomDesign());
    }
    
    return designs;
  }
}

export { RandomDesignGenerator, type GeneratedDesign, type SVGOverlay, type CanvasEffect };
