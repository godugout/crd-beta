
/**
 * Oakland Memory Data interface
 */
export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
  template?: string;
  teamId?: string;
}

export interface OaklandTemplateOptions {
  name: string;
  description: string;
  years: string;
  icon: React.ReactNode;
}
