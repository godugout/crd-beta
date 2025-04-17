
import { JsonValue } from './index';

/**
 * OaklandMemoryData interface for storing Oakland related memory data
 * Now properly compatible with JsonValue index signature
 */
export interface OaklandMemoryData {
  [key: string]: JsonValue | string | string[] | undefined;
  
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
}
