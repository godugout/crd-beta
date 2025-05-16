
// cardElementsAdapter.ts
import { CardElement, ElementType, ElementCategory, ElementUploadMetadata, ElementPosition, ElementSize } from '@/lib/types/cardElements';

/**
 * Adapter to convert between different element formats
 */
export function adaptElementPosition(position: any): ElementPosition {
  if (!position) {
    return { x: 0, y: 0, z: 0 };
  }
  
  return {
    x: position.x || 0,
    y: position.y || 0,
    z: position.z || 0,
    rotation: position.rotation || 0 // Add rotation if available
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
    position: { 
      x: 0, 
      y: 0, 
      z: 0 
    },
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
export function adaptElementSize(size: any): ElementSize {
  if (!size) {
    return { width: 200, height: 200, scale: 1 };
  }
  
  // Calculate aspect ratio if needed
  const width = size.width || 200;
  const height = size.height || 200;
  
  return {
    width,
    height,
    scale: size.scale || 1,
    aspectRatio: width / height // Calculate aspect ratio
  };
}

// Add more adapter functions as needed
