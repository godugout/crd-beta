
export interface ProfessionalTemplateConfig {
  layout: {
    type: 'vintage_card' | 'modern_split' | 'poster' | 'scrapbook' | 'magazine_cover' | 'plaque' | 'banner' | 'comic';
    grid: '3x4' | '2x3' | 'full_bleed' | 'split_screen';
    contentZones: {
      heroImage: { x: number; y: number; width: number; height: number };
      title: { x: number; y: number; width: number; height: number };
      subtitle: { x: number; y: number; width: number; height: number };
      body: { x: number; y: number; width: number; height: number };
      stats?: { x: number; y: number; width: number; height: number };
      logo?: { x: number; y: number; width: number; height: number };
    };
  };
  typography: {
    hero: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      letterSpacing: string;
      lineHeight?: string;
      textTransform?: string;
      textShadow?: string;
    };
    subtitle: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      letterSpacing: string;
      lineHeight?: string;
      textTransform?: string;
      textShadow?: string;
    };
    body: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      letterSpacing: string;
      lineHeight: string;
      textTransform?: string;
      textShadow?: string;
    };
    accent: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      letterSpacing: string;
      lineHeight?: string;
      textTransform?: string;
      textShadow?: string;
    };
  };
  effects: {
    background: string;
    overlay?: string;
    border: string;
    texture?: string;
    foil?: string[];
    animation?: string[];
    shadows?: string;
    glows?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
  };
  materials: {
    finish: 'matte' | 'gloss' | 'holographic' | 'metallic' | 'textured';
    premium: boolean;
  };
}

export interface ProfessionalOaklandTemplate {
  id: string;
  name: string;
  category: 'nostalgia' | 'protest' | 'community' | 'celebration' | 'championship';
  era: 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  description: string;
  preview_url: string;
  config: ProfessionalTemplateConfig;
  tags: string[];
  premium: boolean;
}

export const PROFESSIONAL_OAKLAND_TEMPLATES: ProfessionalOaklandTemplate[] = [
  // Nostalgia Templates
  {
    id: 'classic-dynasty',
    name: 'Dynasty Gold',
    category: 'nostalgia',
    era: 'dynasty_70s',
    description: 'Vintage championship card with ornate gold borders and classic typography',
    preview_url: '/assets/templates/dynasty-gold.jpg',
    premium: true,
    config: {
      layout: {
        type: 'vintage_card',
        grid: '3x4',
        contentZones: {
          heroImage: { x: 8, y: 8, width: 84, height: 45 },
          title: { x: 8, y: 56, width: 84, height: 12 },
          subtitle: { x: 8, y: 70, width: 84, height: 8 },
          body: { x: 8, y: 80, width: 84, height: 12 },
          logo: { x: 75, y: 75, width: 15, height: 15 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Playfair Display',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '800',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        },
        subtitle: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
          fontWeight: '500',
          letterSpacing: '0.05em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontWeight: '400',
          lineHeight: '1.4'
        },
        accent: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
          fontWeight: '600'
        }
      },
      effects: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b00 50%, #1a1a1a 100%)',
        overlay: 'radial-gradient(circle at center, rgba(239,178,30,0.1) 0%, transparent 70%)',
        border: '3px solid #EFB21E',
        texture: 'vintage-paper',
        foil: ['title-foil', 'border-foil'],
        animation: ['gold-shimmer'],
        shadows: '0 8px 32px rgba(239,178,30,0.3)',
        glows: 'inset 0 1px 0 rgba(255,255,255,0.1)'
      },
      colors: {
        primary: '#EFB21E',
        secondary: '#003831',
        accent: '#FFD700',
        text: '#FFFFFF',
        textSecondary: 'rgba(255,255,255,0.8)'
      },
      materials: {
        finish: 'metallic',
        premium: true
      }
    },
    tags: ['championship', 'vintage', 'premium', 'gold']
  },
  {
    id: 'coliseum-concrete',
    name: 'Coliseum Memories',
    category: 'nostalgia',
    era: 'playoff_runs',
    description: 'Industrial stadium aesthetic with concrete textures and architectural elements',
    preview_url: '/assets/templates/coliseum-concrete.jpg',
    premium: false,
    config: {
      layout: {
        type: 'modern_split',
        grid: 'split_screen',
        contentZones: {
          heroImage: { x: 0, y: 0, width: 60, height: 100 },
          title: { x: 65, y: 10, width: 30, height: 15 },
          subtitle: { x: 65, y: 28, width: 30, height: 10 },
          body: { x: 65, y: 42, width: 30, height: 25 },
          stats: { x: 65, y: 70, width: 30, height: 25 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Bebas Neue',
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: '400',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        },
        subtitle: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
          fontWeight: '600',
          letterSpacing: '0.02em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)',
          fontWeight: '400',
          lineHeight: '1.5'
        },
        accent: {
          fontFamily: 'Courier Prime',
          fontSize: 'clamp(0.7rem, 1.6vw, 0.85rem)',
          fontWeight: '700'
        }
      },
      effects: {
        background: 'linear-gradient(45deg, #4A4A4A 0%, #6B7280 50%, #374151 100%)',
        texture: 'concrete-grain',
        border: '2px solid #9CA3AF',
        shadows: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        glows: '0 0 20px rgba(239,178,30,0.2)'
      },
      colors: {
        primary: '#EFB21E',
        secondary: '#6B7280',
        accent: '#F3F4F6',
        text: '#FFFFFF',
        textSecondary: '#D1D5DB'
      },
      materials: {
        finish: 'textured',
        premium: false
      }
    },
    tags: ['stadium', 'concrete', 'industrial', 'memories']
  },

  // Protest Templates
  {
    id: 'sell-team-activist',
    name: 'Sell The Team',
    category: 'protest',
    era: 'farewell',
    description: 'Bold activist poster design with strong typography and glitch effects',
    preview_url: '/assets/templates/sell-team.jpg',
    premium: true,
    config: {
      layout: {
        type: 'poster',
        grid: 'full_bleed',
        contentZones: {
          heroImage: { x: 0, y: 0, width: 100, height: 60 },
          title: { x: 10, y: 65, width: 80, height: 20 },
          subtitle: { x: 10, y: 85, width: 80, height: 10 },
          body: { x: 10, y: 90, width: 80, height: 8 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Impact',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '900',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        },
        subtitle: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          fontWeight: '600',
          letterSpacing: '0.08em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontWeight: '500',
          lineHeight: '1.3'
        },
        accent: {
          fontFamily: 'Impact',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
          fontWeight: '700'
        }
      },
      effects: {
        background: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 50%, #1F2937 100%)',
        overlay: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        border: '4px solid #FFFFFF',
        animation: ['protest-glitch', 'urgency-pulse'],
        shadows: '0 0 30px rgba(220,38,38,0.6)',
        glows: 'text-shadow: 0 0 10px rgba(255,255,255,0.8)'
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#DC2626',
        accent: '#FEF2F2',
        text: '#FFFFFF',
        textSecondary: '#FECACA'
      },
      materials: {
        finish: 'gloss',
        premium: true
      }
    },
    tags: ['protest', 'activism', 'bold', 'statement']
  },

  // Community Templates
  {
    id: 'tailgate-family',
    name: 'Tailgate Family',
    category: 'community',
    era: 'playoff_runs',
    description: 'Warm scrapbook style with polaroid elements and family gathering vibes',
    preview_url: '/assets/templates/tailgate-family.jpg',
    premium: false,
    config: {
      layout: {
        type: 'scrapbook',
        grid: '2x3',
        contentZones: {
          heroImage: { x: 15, y: 15, width: 35, height: 45 },
          title: { x: 55, y: 20, width: 40, height: 15 },
          subtitle: { x: 55, y: 38, width: 40, height: 8 },
          body: { x: 15, y: 65, width: 70, height: 25 },
          stats: { x: 55, y: 48, width: 35, height: 12 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Caveat',
          fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
          fontWeight: '700',
          letterSpacing: '0.01em'
        },
        subtitle: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.9rem, 2.3vw, 1.2rem)',
          fontWeight: '500',
          letterSpacing: '0.02em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontWeight: '400',
          lineHeight: '1.6'
        },
        accent: {
          fontFamily: 'Caveat',
          fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
          fontWeight: '600'
        }
      },
      effects: {
        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #D2B48C 100%)',
        texture: 'wood-grain',
        border: '6px solid #DEB887',
        shadows: '0 4px 20px rgba(139,69,19,0.4)',
        glows: 'inset 0 1px 0 rgba(255,255,255,0.2)'
      },
      colors: {
        primary: '#EFB21E',
        secondary: '#8B4513',
        accent: '#F5DEB3',
        text: '#2F1B14',
        textSecondary: '#8B4513'
      },
      materials: {
        finish: 'matte',
        premium: false
      }
    },
    tags: ['family', 'community', 'warm', 'gathering']
  },

  // Celebration Templates
  {
    id: 'walk-off-magic',
    name: 'Walk-Off Magic',
    category: 'celebration',
    era: 'moneyball',
    description: 'Dynamic sports magazine cover with action photography and victory elements',
    preview_url: '/assets/templates/walk-off.jpg',
    premium: true,
    config: {
      layout: {
        type: 'magazine_cover',
        grid: '3x4',
        contentZones: {
          heroImage: { x: 0, y: 0, width: 100, height: 70 },
          title: { x: 10, y: 5, width: 80, height: 20 },
          subtitle: { x: 10, y: 75, width: 60, height: 10 },
          body: { x: 10, y: 86, width: 80, height: 12 },
          stats: { x: 70, y: 75, width: 25, height: 20 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: '800',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)'
        },
        subtitle: {
          fontFamily: 'Inter',
          fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
          fontWeight: '700',
          letterSpacing: '0.03em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontWeight: '500',
          lineHeight: '1.4'
        },
        accent: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(0.9rem, 2.3vw, 1.1rem)',
          fontWeight: '600'
        }
      },
      effects: {
        background: 'radial-gradient(circle at center, #059669 0%, #047857 50%, #064E3B 100%)',
        overlay: 'linear-gradient(45deg, transparent 60%, rgba(255,215,0,0.3) 100%)',
        border: '3px solid #FFD700',
        animation: ['victory-sparkle', 'golden-pulse'],
        shadows: '0 12px 40px rgba(5,150,105,0.4)',
        glows: '0 0 25px rgba(255,215,0,0.6)'
      },
      colors: {
        primary: '#FFD700',
        secondary: '#059669',
        accent: '#FEF3C7',
        text: '#FFFFFF',
        textSecondary: '#D1FAE5'
      },
      materials: {
        finish: 'holographic',
        premium: true
      }
    },
    tags: ['victory', 'celebration', 'dynamic', 'sports']
  },

  // Championship Templates
  {
    id: 'bash-brothers-power',
    name: 'Bash Brothers',
    category: 'championship',
    era: 'bash_brothers',
    description: 'Comic book style with explosive power elements and retro 80s design',
    preview_url: '/assets/templates/bash-brothers.jpg',
    premium: true,
    config: {
      layout: {
        type: 'comic',
        grid: '3x4',
        contentZones: {
          heroImage: { x: 10, y: 10, width: 80, height: 50 },
          title: { x: 10, y: 65, width: 80, height: 18 },
          subtitle: { x: 15, y: 83, width: 70, height: 8 },
          body: { x: 15, y: 92, width: 70, height: 6 }
        }
      },
      typography: {
        hero: {
          fontFamily: 'Bangers',
          fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)',
          fontWeight: '400',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: '4px 4px 0px #000000, 8px 8px 0px rgba(0,0,0,0.3)'
        },
        subtitle: {
          fontFamily: 'Oswald',
          fontSize: 'clamp(1rem, 2.8vw, 1.3rem)',
          fontWeight: '600',
          letterSpacing: '0.06em'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
          fontWeight: '600',
          lineHeight: '1.3'
        },
        accent: {
          fontFamily: 'Bangers',
          fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
          fontWeight: '400'
        }
      },
      effects: {
        background: 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 50%, #581C87 100%)',
        overlay: 'radial-gradient(ellipse at top, rgba(59,130,246,0.3) 0%, transparent 60%)',
        border: '4px solid #FBBF24',
        texture: 'comic-dots',
        animation: ['power-burst', 'retro-glow'],
        shadows: '0 0 40px rgba(251,191,36,0.5)',
        glows: 'box-shadow: inset 0 0 20px rgba(59,130,246,0.3)'
      },
      colors: {
        primary: '#FBBF24',
        secondary: '#1E3A8A',
        accent: '#FEF3C7',
        text: '#FFFFFF',
        textSecondary: '#DBEAFE'
      },
      materials: {
        finish: 'gloss',
        premium: true
      }
    },
    tags: ['power', 'retro', '80s', 'comic', 'bash-brothers']
  }
];

export const getProfessionalTemplateById = (id: string) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.find(template => template.id === id);
};

export const getProfessionalTemplatesByCategory = (category: ProfessionalOaklandTemplate['category']) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.filter(template => template.category === category);
};

export const getProfessionalTemplatesByEra = (era: ProfessionalOaklandTemplate['era']) => {
  return PROFESSIONAL_OAKLAND_TEMPLATES.filter(template => template.era === era);
};
