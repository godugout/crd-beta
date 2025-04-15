
import { BaseEntity } from './index';
import { Card } from './card';

export interface Collection extends BaseEntity {
  title: string;
  description?: string;
  coverImageUrl?: string;
  userId: string;
  cards?: Card[];
  isPublic?: boolean;
  isFeature?: boolean;
  viewCount?: number;
  tags?: string[];
}
