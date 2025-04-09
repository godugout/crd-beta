
export interface Team {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  memberCount?: number;
  
  // New fields from our enhanced schema
  team_code?: string;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  founded_year?: number;
  city?: string;
  state?: string;
  country?: string;
  stadium?: string;
  mascot?: string;
  league?: string;
  division?: string;
  is_active?: boolean;
  
  // Original properties
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
}
