
export interface CardStyle {
  borderRadius: string;
  effect: string;
  borderColor?: string;
  backgroundColor?: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textShadow?: string;
}

export interface CardEditorState {
  imageFile: File | null;
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  fabricSwatches: FabricSwatch[];
  cardStyle: CardStyle;
  textStyle: TextStyle;
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardMetadata {
  cardStyle: CardStyle;
  textStyle: TextStyle;
}

export interface OaklandMemoryMetadata {
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  template?: string;
  teamId?: string;
  historicalContext?: string;
  personalSignificance?: string;
}
