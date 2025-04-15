
import { BaseEntity } from './index';
import { Card } from './card';

export interface Collection extends BaseEntity {
  title: string;
  description: string;
  coverImageUrl?: string;
  userId: string;
  cards?: Card[];
  isPublic?: boolean;
  tags?: string[];
  featured?: boolean;
  viewCount?: number;
  name?: string; // For backward compatibility
}
