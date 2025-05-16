
import { CardElement } from '../types/cardElements';
import { CardLayer } from '../types/cardTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapter to convert between CardElements and CardLayers
 */
export const cardElementsAdapter = {
  /**
   * Convert a CardElement to a CardLayer
   */
  toCardLayer(element: CardElement): CardLayer {
    // Base shared properties
    const layer: CardLayer = {
      id: uuidv4(),
      type: this.mapElementTypeToLayerType(element.type),
      content: element.assetUrl,
      position: {
        x: element.position.x,
        y: element.position.y,
        z: element.position.z,
      },
      size: {
        width: element.size.width,
        height: element.size.height,
      },
      rotation: element.position.rotation,
      opacity: element.style?.opacity || 1,
      zIndex: element.position.z,
      visible: true,
      locked: false,
    };

    // Add type-specific properties
    switch (element.type) {
      case 'sticker':
        layer.imageUrl = element.assetUrl;
        break;
        
      case 'logo':
        layer.imageUrl = element.assetUrl;
        break;
        
      case 'frame':
        layer.imageUrl = element.assetUrl;
        layer.shapeType = 'frame';
        break;
        
      case 'badge':
        layer.imageUrl = element.assetUrl;
        break;
        
      case 'overlay':
        layer.imageUrl = element.assetUrl;
        layer.opacity = (element as any).intensity || 1;
        layer.style = {
          ...layer.style,
          mixBlendMode: (element as any).blendMode || 'normal'
        };
        break;
    }

    return layer;
  },

  /**
   * Convert a CardLayer to a CardElement
   */
  toCardElement(layer: CardLayer): CardElement | null {
    const elementType = this.mapLayerTypeToElementType(layer.type);
    if (!elementType) return null;

    // Base element properties
    const element: Partial<CardElement> = {
      id: layer.id,
      type: elementType,
      name: `${elementType} Element`,
      assetUrl: layer.imageUrl || layer.content as string,
      tags: [],
      category: 'custom',
      isOfficial: false,
      position: {
        x: layer.position.x,
        y: layer.position.y,
        z: layer.position.z,
        rotation: layer.rotation,
      },
      size: {
        width: typeof layer.size.width === 'number' ? layer.size.width : 100,
        height: typeof layer.size.height === 'number' ? layer.size.height : 100,
        scale: 1,
        aspectRatio: 
          typeof layer.size.width === 'number' && typeof layer.size.height === 'number'
            ? layer.size.width / layer.size.height
            : 1,
        preserveAspectRatio: true,
      },
      style: {
        opacity: layer.opacity,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add type-specific properties
    switch (elementType) {
      case 'sticker':
        return {
          ...element,
          isAnimated: false,
        } as any;
        
      case 'logo':
        return {
          ...element,
          isVector: layer.content?.toString().includes('.svg') || false,
        } as any;
        
      case 'frame':
        return {
          ...element,
          frameType: 'full',
          thickness: 10,
          isResizable: true,
        } as any;
        
      case 'badge':
        return {
          ...element,
          badgeType: 'custom',
        } as any;
        
      case 'overlay':
        return {
          ...element,
          overlayType: 'filter',
          blendMode: (layer.style?.mixBlendMode as any) || 'normal',
          intensity: layer.opacity,
        } as any;
    }

    return null;
  },

  /**
   * Convert an element type to a layer type
   */
  mapElementTypeToLayerType(elementType: string): 'image' | 'text' | 'shape' | 'effect' {
    switch (elementType) {
      case 'sticker':
        return 'image';
      case 'logo':
        return 'image';
      case 'frame':
        return 'shape';
      case 'badge':
        return 'image';
      case 'overlay':
        return 'effect';
      default:
        return 'image';
    }
  },

  /**
   * Convert a layer type to an element type
   */
  mapLayerTypeToElementType(layerType: string): 'sticker' | 'logo' | 'frame' | 'badge' | 'overlay' | null {
    switch (layerType) {
      case 'image':
        return 'sticker'; // Default mapping, needs additional context to determine if it's a logo, badge, etc.
      case 'shape':
        return 'frame';
      case 'effect':
        return 'overlay';
      default:
        return null;
    }
  },

  /**
   * Convert multiple CardElements to CardLayers
   */
  toCardLayers(elements: CardElement[]): CardLayer[] {
    return elements.map(element => this.toCardLayer(element));
  },

  /**
   * Convert multiple CardLayers to CardElements
   */
  toCardElements(layers: CardLayer[]): CardElement[] {
    return layers
      .map(layer => this.toCardElement(layer))
      .filter((element): element is CardElement => element !== null);
  }
};
