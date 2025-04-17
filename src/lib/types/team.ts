
import { BaseEntity } from './index';
import { User } from './user';

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  ownerId: string;
  owner?: User;
  members?: TeamMember[];
  visibility?: 'public' | 'private' | 'unlisted';
}

export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
  team?: Team;
}
