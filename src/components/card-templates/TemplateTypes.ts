
export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  category: string;
  isOfficial?: boolean;
  popularity?: number;
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
