
import { BaseEntity, JsonValue } from './index';
import { User } from './user';

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
  [key: string]: JsonValue | undefined;
}

export interface OaklandMemory extends BaseEntity {
  userId: string;
  data: OaklandMemoryData;
  isPublic: boolean;
  imageUrl?: string;
  user?: User;
}
