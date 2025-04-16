
/**
 * Digital asset types for the DAM system
 */

export interface DigitalAsset {
  id: string;
  title: string;
  description?: string;
  original_filename: string;
  mime_type: string;
  storage_path: string;
  thumbnail_path?: string;
  file_size: number;
  width?: number;
  height?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  tags: string[];
}

export interface AssetCollection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  asset_ids: string[];
  cover_asset_id?: string;
}

export interface AssetTag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  category?: string;
}
