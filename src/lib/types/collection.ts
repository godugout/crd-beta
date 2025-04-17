
import { Card, BaseEntity } from './index';

export interface Collection extends BaseEntity {
  name: string;
  title?: string; // Add title property for backward compatibility
  description: string;
  coverImageUrl: string;
  userId: string;
  cards?: Card[];
  cardIds: string[];
  visibility: 'public' | 'private' | 'team';
  allowComments: boolean;
  designMetadata?: any;
  tags: string[];
  isPublic?: boolean; // Keep isPublic flag for compatibility
  teamId?: string; // Keep teamId for compatibility
}
