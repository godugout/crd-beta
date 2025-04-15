
export interface TeamDisplayData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  memberCount?: number;
  owner_id: string;
  primary_color?: string;
  secondary_color?: string;
  founded_year?: number;
  city?: string;
  state?: string;
  stadium?: string;
  league?: string;
  division?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: {
    id: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
  };
}
