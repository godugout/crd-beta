
import { CardElement, ElementType, ElementCategory, ElementPosition, ElementSize, ElementTransform } from '@/lib/types/cardElements';
import type { User, Comment, Collection } from '@/lib/types/user';
import { CardDesignMetadata, Card, CardStyle, TextStyle } from '@/lib/types/cardTypes';

/**
 * Adapts a raw comment to the Comment interface
 */
export function adaptComment(rawComment: any): Comment {
  return {
    id: rawComment.id,
    text: rawComment.text || rawComment.content,
    cardId: rawComment.card_id || rawComment.cardId,
    userId: rawComment.user_id || rawComment.userId,
    parentId: rawComment.parent_id || rawComment.parentId,
    createdAt: rawComment.created_at || rawComment.createdAt,
    updatedAt: rawComment.updated_at || rawComment.updatedAt,
    user: rawComment.user ? adaptUser(rawComment.user) : undefined
  };
}

/**
 * Adapts a raw user to the User interface
 */
export function adaptUser(rawUser: any): User {
  return {
    id: rawUser.id,
    name: rawUser.name || rawUser.full_name || rawUser.display_name || '',
    email: rawUser.email || '',
    displayName: rawUser.display_name || rawUser.displayName || rawUser.name || '',
    avatarUrl: rawUser.avatar_url || rawUser.avatarUrl,
    createdAt: rawUser.created_at || rawUser.createdAt,
    updatedAt: rawUser.updated_at || rawUser.updatedAt,
  };
}

/**
 * Maps a string to ElementCategory enum
 */
export function mapToElementCategory(categoryString: string): ElementCategory {
  // Try to match with existing ElementCategory values
  const matchedCategory = Object.values(ElementCategory).find(
    cat => cat.toLowerCase() === categoryString.toLowerCase()
  );
  
  if (matchedCategory) {
    return matchedCategory;
  }

  // Fallback mappings for common categories
  switch (categoryString.toLowerCase()) {
    case 'sticker':
    case 'stickers':
      return ElementCategory.STICKERS;
    case 'team':
    case 'teams':
      return ElementCategory.TEAMS;
    case 'badge':
    case 'badges':
      return ElementCategory.BADGES;
    case 'frame':
    case 'frames':
      return ElementCategory.FRAMES;
    case 'effect':
    case 'effects':
      return ElementCategory.EFFECTS;
    case 'background':
    case 'backgrounds':
      return ElementCategory.BACKGROUNDS;
    case 'decorative':
      return ElementCategory.DECORATIVE;
    case 'logo':
    case 'logos':
      return ElementCategory.LOGO;
    case 'overlay':
    case 'overlays':
      return ElementCategory.OVERLAY;
    case 'texture':
    case 'textures':
      return ElementCategory.TEXTURE;
    case 'icon':
    case 'icons':
      return ElementCategory.ICON;
    case 'shape':
    case 'shapes':
      return ElementCategory.SHAPE;
    default:
      return ElementCategory.STICKERS; // Default fallback
  }
}

/**
 * Maps a string to ElementType enum
 */
export function mapToElementType(typeString: string): ElementType {
  // Try to match with existing ElementType values
  const matchedType = Object.values(ElementType).find(
    type => type.toLowerCase() === typeString.toLowerCase()
  );
  
  if (matchedType) {
    return matchedType;
  }

  // Fallback mappings for common types
  switch (typeString.toLowerCase()) {
    case 'sticker':
      return ElementType.Sticker;
    case 'logo':
      return ElementType.Logo;
    case 'frame':
      return ElementType.Frame;
    case 'badge':
      return ElementType.Badge;
    case 'overlay':
      return ElementType.Overlay;
    default:
      return ElementType.Sticker; // Default fallback
  }
}

/**
 * Adapts an element upload to a CardElement
 */
export function elementUploadToCardElement(uploadData: any): CardElement {
  const position: ElementPosition = {
    x: uploadData.position?.x || 0,
    y: uploadData.position?.y || 0,
    z: uploadData.position?.z || 0
  };
  
  const size: ElementSize = {
    width: uploadData.size?.width || 100,
    height: uploadData.size?.height || 100,
    scale: uploadData.size?.scale || 1
  };
  
  const transform: ElementTransform = {
    rotation: uploadData.transform?.rotation || 0,
    scale: uploadData.transform?.scale || 1,
    translateX: uploadData.transform?.translateX || 0,
    translateY: uploadData.transform?.translateY || 0,
    scaleX: uploadData.transform?.scaleX || 1,
    scaleY: uploadData.transform?.scaleY || 1,
    rotate: uploadData.transform?.rotate || 0
  };
  
  return {
    id: uploadData.id,
    name: uploadData.name || 'New Element',
    description: uploadData.description || '',
    url: uploadData.assetUrl || uploadData.url || '',
    assetUrl: uploadData.assetUrl || uploadData.url || '',
    thumbnailUrl: uploadData.thumbnailUrl || uploadData.assetUrl || uploadData.url,
    type: uploadData.type as ElementType || 'image',
    category: uploadData.category as ElementCategory || 'general',
    tags: uploadData.tags || [],
    position,
    size,
    transform,
    zIndex: uploadData.zIndex || 0,
    isOfficial: uploadData.isOfficial || false,
    creatorId: uploadData.creatorId || 'system'
  };
}

/**
 * Adapts card design metadata to the expected format
 */
export function adaptCardDesignMetadata(metadata: any): CardDesignMetadata {
  return {
    cardStyle: {
      template: metadata?.cardStyle?.template || 'default',
      effect: metadata?.cardStyle?.effect || 'none',
      borderRadius: metadata?.cardStyle?.borderRadius || '8px',
      borderColor: metadata?.cardStyle?.borderColor || '#000000',
      frameColor: metadata?.cardStyle?.frameColor || '#ffffff',
      frameWidth: metadata?.cardStyle?.frameWidth || 0,
      shadowColor: metadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)'
    },
    textStyle: {
      titleColor: metadata?.textStyle?.titleColor || '#000000',
      titleAlignment: metadata?.textStyle?.titleAlignment || 'center',
      titleWeight: metadata?.textStyle?.titleWeight || 'bold',
      descriptionColor: metadata?.textStyle?.descriptionColor || '#333333'
    },
    cardMetadata: metadata?.cardMetadata || {
      category: 'general',
      series: 'default',
      cardType: 'standard'
    },
    marketMetadata: metadata?.marketMetadata || {
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 0,
      editionNumber: 0
    }
  };
}

/**
 * Create default card design metadata with required fields
 */
export function createDefaultCardDesignMetadata(): CardDesignMetadata {
  return {
    cardStyle: {
      template: 'default',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      frameColor: '#ffffff',
      frameWidth: 0,
      shadowColor: 'rgba(0,0,0,0.2)'
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333'
    },
    cardMetadata: {
      category: 'general',
      series: 'default',
      cardType: 'standard'
    },
    marketMetadata: {
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 0,
      editionNumber: 0
    }
  };
}
