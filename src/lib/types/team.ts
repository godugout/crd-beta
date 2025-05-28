
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerId: string;
  primaryColor?: string;
  secondaryColor?: string;
  status?: string;
  website?: string;
  email?: string;
  specialties?: string[];
  visibility?: 'public' | 'private';
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}
