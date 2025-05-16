import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ElementType } from '../types/cardElements';

// Define the types of assets we can upload
const assetTypes = ['image', 'sticker', 'logo', 'frame', 'badge', 'overlay', 'decoration'];

// Define the file types that are allowed for each asset type
const elementTypes: Record<ElementType, string[]> = {
  sticker: ['png', 'svg', 'webp'],
  logo: ['png', 'svg', 'webp'],
  frame: ['png', 'svg', 'webp'],
  badge: ['png', 'svg', 'webp'],
  overlay: ['png', 'svg', 'webp'],
  decoration: ['png', 'svg', 'webp']
};

// Define the maximum file size for each asset type (in bytes)
const maxFileSize = 10 * 1024 * 1024; // 10MB

// Define the storage bucket where assets will be uploaded
const storageBucket = 'assets';

// Define the folder where assets will be uploaded
const storageFolder = 'ugc';

// Define a function to validate the asset
const validateAsset = (asset: File, type: string) => {
  if (!assetTypes.includes(type)) {
    throw new Error(`Invalid asset type: ${type}`);
  }

  if (!elementTypes[type].includes(asset.type.split('/')[1])) {
    throw new Error(`Invalid file type: ${asset.type}`);
  }

  if (asset.size > maxFileSize) {
    throw new Error(`File size exceeds the maximum limit of ${maxFileSize / 1024 / 1024}MB`);
  }
};

// Define a function to upload the asset to storage
const uploadAsset = async (asset: File, type: string) => {
  validateAsset(asset, type);

  const assetId = uuidv4();
  const assetPath = `${storageFolder}/${type}/${assetId}.${asset.type.split('/')[1]}`;

  const { data, error } = await supabase.storage
    .from(storageBucket)
    .upload(assetPath, asset, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload asset: ${error.message}`);
  }

  return {
    assetId,
    assetPath,
    assetUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}/${assetPath}`
  };
};

// Define a function to delete the asset from storage
const deleteAsset = async (assetPath: string) => {
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .remove([assetPath]);

  if (error) {
    throw new Error(`Failed to delete asset: ${error.message}`);
  }

  return data;
};

// Define a function to get the asset URL
const getAssetUrl = (assetPath: string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}/${assetPath}`;
};

// Define a function to measure the performance of an operation
const measurePerformance = (operation: string, assetId: string): PerformanceEntry => {
  const entryName = `${operation}-${assetId}`;
  performance.mark(`${entryName}-start`);
  performance.mark(`${entryName}-end`);
  performance.measure(entryName, `${entryName}-start`, `${entryName}-end`);
  const [entry] = performance.getEntriesByName(entryName);
  performance.clearMarks();
  performance.clearMeasures();
  return entry;
};

// Export all the functions
export const UGCManager = {
  validateAsset,
  uploadAsset,
  deleteAsset,
  getAssetUrl,
  measurePerformance
};
