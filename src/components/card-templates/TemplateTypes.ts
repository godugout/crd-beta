
export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  imageUrl?: string; // Added for backwards compatibility
  category: string;
  isOfficial?: boolean;
  popularity?: number;
  sport?: string; // Added for SettingsPanel
  style?: string; // Added for SettingsPanel
  tags?: string[]; // Added for TemplateSelector
  designDefaults: {
    cardStyle: Partial<CardStyle>;
    textStyle?: Partial<TextStyle>;
    effects?: string[];
  };
}

export interface CardStyle {
  template: string;
  effect: string;
  borderRadius: string;
  borderColor: string;
  backgroundColor?: string;
  shadowColor: string;
  frameWidth: number;
  frameColor: string;
  [key: string]: any;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  titleColor: string;
  titleAlignment: string;
  titleWeight: string;
  descriptionColor: string;
  [key: string]: any;
}

// Add default styles to be used in TemplateSelector
export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000'
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333'
};
