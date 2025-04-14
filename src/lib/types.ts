
// Card interface - extend with baseball stats
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  player?: string;
  team?: string;
  year?: string;
  position?: string;
  rarity?: string;
  
  // Baseball card stats
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
  careerYears?: string;
  ranking?: string;
  estimatedValue?: string;
  condition?: string;
  
  // Design metadata
  designMetadata?: {
    cardStyle?: {
      borderRadius?: string;
      borderWidth?: number;
      borderColor?: string;
      backgroundColor?: string;
      effect?: string;
    }
  }
}
