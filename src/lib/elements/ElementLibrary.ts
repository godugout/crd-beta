
import { 
  CardElement, 
  ElementType, 
  ElementCategory, 
  StickerElement, 
  LogoElement, 
  FrameElement, 
  BadgeElement,
  OverlayElement,
  ElementLibraryCollection
} from '../types/cardElements';

/**
 * Service for managing the library of card elements
 */
export class ElementLibrary {
  private elements: Map<string, CardElement> = new Map();
  private collections: Map<string, ElementLibraryCollection> = new Map();

  /**
   * Get all elements in the library
   */
  getAllElements(): CardElement[] {
    return Array.from(this.elements.values());
  }

  /**
   * Get elements by type
   */
  getElementsByType(type: ElementType): CardElement[] {
    return this.getAllElements().filter(element => element.type === type);
  }

  /**
   * Get elements by category
   */
  getElementsByCategory(category: ElementCategory): CardElement[] {
    return this.getAllElements().filter(element => element.category === category);
  }

  /**
   * Get elements by tags
   */
  getElementsByTags(tags: string[]): CardElement[] {
    return this.getAllElements().filter(element => 
      tags.some(tag => element.tags.includes(tag))
    );
  }

  /**
   * Get element by ID
   */
  getElementById(id: string): CardElement | undefined {
    return this.elements.get(id);
  }

  /**
   * Add an element to the library
   */
  addElement(element: CardElement): void {
    this.elements.set(element.id, element);
  }

  /**
   * Update an existing element
   */
  updateElement(id: string, updates: Partial<CardElement>): boolean {
    const element = this.elements.get(id);
    if (!element) return false;

    this.elements.set(id, { ...element, ...updates, updatedAt: new Date().toISOString() });
    return true;
  }

  /**
   * Remove an element from the library
   */
  removeElement(id: string): boolean {
    return this.elements.delete(id);
  }

  /**
   * Get all collections in the library
   */
  getAllCollections(): ElementLibraryCollection[] {
    return Array.from(this.collections.values());
  }

  /**
   * Get collection by ID
   */
  getCollectionById(id: string): ElementLibraryCollection | undefined {
    return this.collections.get(id);
  }

  /**
   * Get elements in a collection
   */
  getElementsByCollection(collectionId: string): CardElement[] {
    const collection = this.collections.get(collectionId);
    if (!collection) return [];

    return collection.elementIds
      .map(id => this.elements.get(id))
      .filter((element): element is CardElement => element !== undefined);
  }

  /**
   * Add a collection to the library
   */
  addCollection(collection: ElementLibraryCollection): void {
    this.collections.set(collection.id, collection);
  }

  /**
   * Update an existing collection
   */
  updateCollection(id: string, updates: Partial<ElementLibraryCollection>): boolean {
    const collection = this.collections.get(id);
    if (!collection) return false;

    this.collections.set(id, { 
      ...collection, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    });
    return true;
  }

  /**
   * Remove a collection from the library
   */
  removeCollection(id: string): boolean {
    return this.collections.delete(id);
  }

  /**
   * Add an element to a collection
   */
  addElementToCollection(elementId: string, collectionId: string): boolean {
    const collection = this.collections.get(collectionId);
    const element = this.elements.get(elementId);
    
    if (!collection || !element) return false;
    
    if (!collection.elementIds.includes(elementId)) {
      collection.elementIds.push(elementId);
      this.collections.set(collectionId, {
        ...collection,
        updatedAt: new Date().toISOString()
      });
    }
    
    return true;
  }

  /**
   * Remove an element from a collection
   */
  removeElementFromCollection(elementId: string, collectionId: string): boolean {
    const collection = this.collections.get(collectionId);
    if (!collection) return false;
    
    const index = collection.elementIds.indexOf(elementId);
    if (index === -1) return false;
    
    collection.elementIds.splice(index, 1);
    this.collections.set(collectionId, {
      ...collection,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  }

  /**
   * Create a new element based on type and data
   */
  createElement(
    type: ElementType, 
    data: Omit<CardElement, 'id' | 'type' | 'createdAt' | 'updatedAt'>
  ): CardElement {
    const now = new Date().toISOString();
    const id = `element-${Math.random().toString(36).substring(2, 15)}`;
    
    const baseElement: CardElement = {
      id,
      type,
      name: data.name,
      assetUrl: data.assetUrl,
      thumbnailUrl: data.thumbnailUrl,
      description: data.description,
      tags: data.tags || [],
      category: data.category,
      isOfficial: data.isOfficial || false,
      position: data.position,
      size: data.size,
      style: data.style,
      metadata: data.metadata,
      createdAt: now,
      updatedAt: now,
      creatorId: data.creatorId
    };
    
    let element: CardElement;
    
    switch (type) {
      case 'sticker':
        element = {
          ...baseElement,
          isAnimated: false,
          ...(data as Partial<StickerElement>)
        } as StickerElement;
        break;
        
      case 'logo':
        element = {
          ...baseElement,
          isVector: false,
          ...(data as Partial<LogoElement>)
        } as LogoElement;
        break;
        
      case 'frame':
        element = {
          ...baseElement,
          frameType: 'full',
          thickness: 10,
          isResizable: true,
          ...(data as Partial<FrameElement>)
        } as FrameElement;
        break;
        
      case 'badge':
        element = {
          ...baseElement,
          badgeType: 'custom',
          ...(data as Partial<BadgeElement>)
        } as BadgeElement;
        break;
        
      case 'overlay':
        element = {
          ...baseElement,
          overlayType: 'filter',
          blendMode: 'normal',
          intensity: 1,
          ...(data as Partial<OverlayElement>)
        } as OverlayElement;
        break;
        
      default:
        element = baseElement;
    }
    
    this.addElement(element);
    return element;
  }
}

// Export a singleton instance
export const elementLibrary = new ElementLibrary();
