export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  designMetadata?: {
    cardStyle: any;
    textStyle: any;
    oaklandMemory?: {
      date?: string;
      opponent?: string;
      score?: string;
      location?: string;
      section?: string;
      memoryType?: string;
      attendees?: string[];
      template?: string;
      teamId?: string;
    };
  };
  tags?: string[];
}
