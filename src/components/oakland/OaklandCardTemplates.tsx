
export type OaklandTemplateType = 
  | 'classic' 
  | 'moneyball' 
  | 'dynasty' 
  | 'coliseum' 
  | 'tailgate'
  | 'bashbrothers';

export interface OaklandTemplate {
  id: OaklandTemplateType;
  name: string;
  description: string;
  era: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  theme: {
    background: string;
    textColor: string;
    borderColor: string;
  };
}

export const OAKLAND_TEMPLATES: Record<OaklandTemplateType, OaklandTemplate> = {
  classic: {
    id: 'classic',
    name: 'Classic Green & Gold',
    description: 'Timeless A\'s colors with clean design',
    era: 'All-Time Classic',
    colors: {
      primary: '#006341',
      secondary: '#EFB21E', 
      accent: '#FFFFFF'
    },
    theme: {
      background: 'linear-gradient(135deg, #006341 0%, #003831 100%)',
      textColor: '#FFFFFF',
      borderColor: '#EFB21E'
    }
  },
  moneyball: {
    id: 'moneyball',
    name: 'Moneyball Era',
    description: 'Early 2000s statistical revolution style',
    era: '2002-2006',
    colors: {
      primary: '#2D5A3D',
      secondary: '#C4A962',
      accent: '#E5E5E5'
    },
    theme: {
      background: 'linear-gradient(135deg, #2D5A3D 0%, #1A3A2A 100%)',
      textColor: '#E5E5E5',
      borderColor: '#C4A962'
    }
  },
  dynasty: {
    id: 'dynasty',
    name: 'Dynasty Years',
    description: 'Championship glory of the 70s',
    era: '1972-1974',
    colors: {
      primary: '#FFD700',
      secondary: '#006341',
      accent: '#003831'
    },
    theme: {
      background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
      textColor: '#003831',
      borderColor: '#006341'
    }
  },
  coliseum: {
    id: 'coliseum',
    name: 'Coliseum Classic',
    description: 'Vintage ballpark atmosphere',
    era: 'Stadium Heritage',
    colors: {
      primary: '#4A5D23',
      secondary: '#EFB21E',
      accent: '#FFFFFF'
    },
    theme: {
      background: 'linear-gradient(135deg, #4A5D23 0%, #2F3A16 100%)',
      textColor: '#FFFFFF',
      borderColor: '#EFB21E'
    }
  },
  tailgate: {
    id: 'tailgate',
    name: 'Tailgate Party',
    description: 'Fan community celebration style',
    era: 'Fan Culture',
    colors: {
      primary: '#8B4513',
      secondary: '#EFB21E',
      accent: '#FFFFFF'
    },
    theme: {
      background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
      textColor: '#FFFFFF',
      borderColor: '#EFB21E'
    }
  },
  bashbrothers: {
    id: 'bashbrothers',
    name: 'Bash Brothers',
    description: 'Power-hitting era of the late 80s',
    era: '1988-1990',
    colors: {
      primary: '#1E3A5F',
      secondary: '#FFD700',
      accent: '#FFFFFF'
    },
    theme: {
      background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D2F 100%)',
      textColor: '#FFFFFF',
      borderColor: '#FFD700'
    }
  }
};
