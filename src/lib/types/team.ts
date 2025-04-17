
import { BaseEntity } from './index';
import { User } from './user';

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  members?: TeamMember[];
}

export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}
