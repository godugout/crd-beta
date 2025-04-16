import { BaseEntity } from './index';
import { Reaction } from './interaction';
import { Comment } from './interaction';

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Card extends BaseEntity {
  title: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  collectionId?: string;
  metadata?: Record<string, any>;
  effects: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  isPublic?: boolean;
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  artist?: string;
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  name?: string;
  cardStyle?: string;
  backTemplate?: string;
}
