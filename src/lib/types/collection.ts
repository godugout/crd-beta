
import { Card, BaseEntity } from './index';

export interface Collection extends BaseEntity {
  name: string;
  description: string;
  coverImageUrl: string;
  userId: string;
  cards?: Card[];
  cardIds: string[];
  visibility: 'public' | 'private' | 'team';
  allowComments: boolean;
  designMetadata?: any;
  tags: string[];
  isPublic?: boolean; // Add isPublic flag for compatibility
  teamId?: string; // Add teamId for compatibility
}
