
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
