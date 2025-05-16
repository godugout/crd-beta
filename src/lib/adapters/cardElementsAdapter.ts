
// cardElementsAdapter.ts
import { CardElement, ElementType, ElementCategory, ElementUploadMetadata } from '@/lib/types/cardElements';

/**
 * Interface for position with rotation
 */
interface PositionWithRotation {
  x: number;
  y: number;
  z: number;
  rotation?: number;
}

/**
 * Interface for size with aspect ratio
 */
interface SizeWithAspectRatio {
  width: number;
  height: number;
  scale?: number;
  aspectRatio?: number;
}

/**
 * Adapter to convert between different element formats
 */
export function adaptElementPosition(position: any): { x: number; y: number; z: number } {
  if (!position) {
    return { x: 0, y: 0, z: 0 };
  }
  
  return {
    x: position.x || 0,
    y: position.y || 0,
    z: position.z || 0,
    // Note: rotation is handled separately and not part of the position object
  };
}

/**
 * Adapter to convert an upload metadata to a card element
 */
export function elementUploadToCardElement(metadata: ElementUploadMetadata): CardElement {
  const now = new Date().toISOString();
  
  return {
    id: `element-${Date.now()}`,
    name: metadata.name || 'Unnamed Element',
    type: metadata.type.toString(),
    url: metadata.imageUrl || '',
    thumbnailUrl: metadata.imageUrl || '',
    description: metadata.description || '',
    tags: metadata.tags || [],
    category: metadata.category.toString(),
    createdAt: now,
    updatedAt: now,
    creatorId: metadata.attribution || 'system',
    isOfficial: false,
    imageUrl: metadata.imageUrl || '',
    position: { x: 0, y: 0, z: 0 },
    size: { 
      width: 200, 
      height: 200,
      scale: 1
    },
    style: {}
  };
}

/**
 * Adapter to convert between different size formats
 */
export function adaptElementSize(size: any): { width: number; height: number; scale?: number } {
  if (!size) {
    return { width: 200, height: 200, scale: 1 };
  }
  
  return {
    width: size.width || 200,
    height: size.height || 200,
    scale: size.scale || 1,
    // Note: aspectRatio is calculated, not stored
  };
}

// Add more adapter functions as needed
