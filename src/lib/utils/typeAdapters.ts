
import { ElementCategory, ElementUploadMetadata, CardElement } from '../types/cardElements';
import { Collection, CollectionDisplayData } from '../types/collection';

/**
 * Convert ElementUploadMetadata to CardElement
 */
export function elementUploadToCardElement(metadata: ElementUploadMetadata): CardElement {
  const now = new Date().toISOString();
  
  return {
    id: metadata.id || `element-${Date.now()}`,
    name: metadata.name,
    description: metadata.description || '',
    type: metadata.type,
    category: metadata.category,
    url: metadata.url,
    imageUrl: metadata.imageUrl || '',
    thumbnailUrl: metadata.thumbnailUrl,
    tags: metadata.tags || [],
    position: metadata.position,
    size: metadata.size,
    rotation: metadata.rotation,
    metadata: metadata.metadata,
    attribution: metadata.attribution,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Convert Collection to CollectionDisplayData
 */
export function collectionToDisplayData(collection: Collection): CollectionDisplayData {
  return {
    id: collection.id,
    title: collection.title || collection.name || '',
    description: collection.description,
    coverImageUrl: collection.coverImageUrl,
    cardCount: collection.cards?.length || collection.cardIds?.length || 0,
    ownerName: collection.owner?.name || '',
    visibility: collection.visibility || 'public',
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    tags: collection.tags,
    isPublic: collection.isPublic
  };
}

/**
 * Map string values to ElementCategory enum
 */
export function mapToElementCategory(category: string): ElementCategory {
  const categoryMap: Record<string, ElementCategory> = {
    'sticker': ElementCategory.STICKERS,
    'stickers': ElementCategory.STICKERS,
    'team': ElementCategory.TEAMS,
    'teams': ElementCategory.TEAMS,
    'badge': ElementCategory.BADGES,
    'badges': ElementCategory.BADGES,
    'frame': ElementCategory.FRAMES,
    'frames': ElementCategory.FRAMES,
    'effect': ElementCategory.EFFECTS,
    'effects': ElementCategory.EFFECTS,
    'background': ElementCategory.BACKGROUNDS,
    'backgrounds': ElementCategory.BACKGROUNDS,
    'decorative': ElementCategory.DECORATIVE,
    'user-generated': ElementCategory.USER_GENERATED,
    'logo': ElementCategory.LOGO,
    'overlay': ElementCategory.OVERLAY,
    'texture': ElementCategory.TEXTURE,
    'icon': ElementCategory.ICON,
    'shape': ElementCategory.SHAPE
  };
  
  return categoryMap[category.toLowerCase()] || ElementCategory.DECORATIVE;
}
