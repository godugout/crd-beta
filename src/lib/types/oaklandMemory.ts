
/**
 * OaklandMemoryData interface for storing Oakland related memory data
 * This definition is the canonical source for OaklandMemoryData type
 */

// Define the interface properly without using index signatures that cause type errors
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
  // Additional properties can be added here with specific types
  capturedBy?: string;
  eventType?: string;
  linkedMoments?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}
