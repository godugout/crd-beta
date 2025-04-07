
// Define type helpers for mapping between Supabase database schema and application types

export interface DbCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection_id?: string;
  user_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
  tags?: string[];
  design_metadata?: any; // Add this field to match the database schema
  creator_id: string;
  price?: number;
  edition_size: number;
  rarity: string;
}

export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: 'public' | 'private' | 'team';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any; // Add this field to match the database schema
}

// Add other database type interfaces as needed
