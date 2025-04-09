
export interface Team {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  
  // Enhanced team fields
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
}

// Interface for team data coming from Supabase
export interface DbTeam {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
  team_code?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  tertiary_color?: string | null;
  founded_year?: number | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  stadium?: string | null;
  league?: string | null;
  division?: string | null;
  is_active?: boolean | null;
}
