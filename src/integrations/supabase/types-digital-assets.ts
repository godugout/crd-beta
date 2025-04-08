
// Define custom type definitions for digital assets and asset usages
export interface DbDigitalAsset {
  id: string;
  user_id: string;
  storage_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  width?: number | null;
  height?: number | null;
  thumbnail_path?: string | null;
  title?: string | null;
  description?: string | null;
  tags?: string[] | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface DbAssetUsage {
  id: string;
  asset_id: string;
  usage_type: string;
  reference_id: string;
  created_at: string;
}
