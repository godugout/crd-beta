
import { 
  CardElement, 
  ElementPosition, 
  ElementSize, 
  ElementTransform,
  ElementPlacementOptions
} from '../types/cardElements';

/**
 * Engine for placing and positioning elements on a card
 */
export class PlacementEngine {
  private canvas: HTMLElement | null = null;
  private gridSize = 10; // Size of grid for snapping
  private activeElement: CardElement | null = null;
  
  /**
   * Set the canvas element for the placement engine
   */
  setCanvas(element: HTMLElement): void {
    this.canvas = element;
  }
  
  /**
   * Get the canvas element
   */
  getCanvas(): HTMLElement | null {
    return this.canvas;
  }
  
  /**
   * Place an element on the card canvas
   */
  placeElement(
    element: CardElement, 
    options: ElementPlacementOptions = {}
  ): CardElement {
    if (!this.canvas) {
      throw new Error('Canvas not set for placement engine');
    }
    
    const canvasRect = this.canvas.getBoundingClientRect();
    
    // Set default position (center of canvas if not specified)
    let position: ElementPosition = {
      x: options.position?.x ?? canvasRect.width / 2,
      y: options.position?.y ?? canvasRect.height / 2,
      z: options.position?.z ?? 0,
      rotation: options.position?.rotation ?? 0
    };
    
    // Apply snap to grid if enabled
    if (options.snapToGrid) {
      position.x = Math.round(position.x / this.gridSize) * this.gridSize;
      position.y = Math.round(position.y / this.gridSize) * this.gridSize;
    }
    
    // Update the element with new position
    const updatedElement: CardElement = {
      ...element,
      position,
      size: {
        ...element.size,
        ...(options.size || {})
      },
      style: {
        ...element.style,
        ...(options.style || {})
      }
    };
    
    // Set as active element
    this.activeElement = updatedElement;
    
    return updatedElement;
  }
  
  /**
   * Update element position
   */
  updateElementPosition(
    element: CardElement, 
    newPosition: Partial<ElementPosition>,
    snapToGrid = false
  ): CardElement {
    const position: ElementPosition = {
      ...element.position,
      ...newPosition
    };
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      position.x = Math.round(position.x / this.gridSize) * this.gridSize;
      position.y = Math.round(position.y / this.gridSize) * this.gridSize;
    }
    
    return {
      ...element,
      position
    };
  }
  
  /**
   * Update element size
   */
  updateElementSize(
    element: CardElement, 
    newSize: Partial<ElementSize>,
    preserveAspectRatio = true
  ): CardElement {
    let size: ElementSize = {
      ...element.size,
      ...newSize
    };
    
    // Preserve aspect ratio if enabled
    if (preserveAspectRatio && element.size.aspectRatio > 0) {
      if (newSize.width && !newSize.height) {
        size.height = newSize.width / element.size.aspectRatio;
      } else if (newSize.height && !newSize.width) {
        size.width = newSize.height * element.size.aspectRatio;
      }
    }
    
    return {
      ...element,
      size
    };
  }
  
  /**
   * Generate transformation matrix for an element
   */
  getElementTransform(element: CardElement): ElementTransform {
    return {
      translateX: element.position.x,
      translateY: element.position.y,
      rotate: element.position.rotation,
      scaleX: element.size.scale,
      scaleY: element.size.scale
    };
  }
  
  /**
   * Generate CSS transform string for an element
   */
  getElementCssTransform(element: CardElement): string {
    const transform = this.getElementTransform(element);
    
    return `translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scaleX}, ${transform.scaleY})`;
  }
  
  /**
   * Check if a point is inside an element
   */
  isPointInElement(
    x: number, 
    y: number, 
    element: CardElement
  ): boolean {
    // First, adjust for element's position and rotation
    const elementX = element.position.x;
    const elementY = element.position.y;
    const rotation = element.position.rotation * (Math.PI / 180); // Convert to radians
    
    // Adjust for rotation
    const adjustedX = Math.cos(rotation) * (x - elementX) - Math.sin(rotation) * (y - elementY) + elementX;
    const adjustedY = Math.sin(rotation) * (x - elementX) + Math.cos(rotation) * (y - elementY) + elementY;
    
    // Calculate element boundaries
    const halfWidth = element.size.width / 2;
    const halfHeight = element.size.height / 2;
    
    // Check if point is within boundaries
    return (
      adjustedX >= elementX - halfWidth &&
      adjustedX <= elementX + halfWidth &&
      adjustedY >= elementY - halfHeight &&
      adjustedY <= elementY + halfHeight
    );
  }
  
  /**
   * Find an element by position on canvas
   */
  findElementAtPosition(
    x: number, 
    y: number, 
    elements: CardElement[]
  ): CardElement | null {
    // Sort by z-index (highest first) to find the topmost element
    const sortedElements = [...elements].sort((a, b) => b.position.z - a.position.z);
    
    for (const element of sortedElements) {
      if (this.isPointInElement(x, y, element)) {
        return element;
      }
    }
    
    return null;
  }
  
  /**
   * Set the active element
   */
  setActiveElement(element: CardElement | null): void {
    this.activeElement = element;
  }
  
  /**
   * Get the currently active element
   */
  getActiveElement(): CardElement | null {
    return this.activeElement;
  }
  
  /**
   * Set the grid size for snapping
   */
  setGridSize(size: number): void {
    this.gridSize = size;
  }
  
  /**
   * Get alignment guides for element placement
   */
  getAlignmentGuides(
    element: CardElement, 
    allElements: CardElement[],
    threshold = 5
  ): { horizontal: number[]; vertical: number[] } {
    const otherElements = allElements.filter(e => e.id !== element.id);
    
    const guides = {
      horizontal: [] as number[],
      vertical: [] as number[]
    };
    
    // Add canvas center lines
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      guides.horizontal.push(rect.height / 2);
      guides.vertical.push(rect.width / 2);
    }
    
    // Add element alignment guides
    for (const other of otherElements) {
      // Get the center points
      guides.horizontal.push(other.position.y);
      guides.vertical.push(other.position.x);
      
      // Get the edges
      const otherHalfWidth = other.size.width / 2;
      const otherHalfHeight = other.size.height / 2;
      
      guides.horizontal.push(other.position.y - otherHalfHeight); // Top
      guides.horizontal.push(other.position.y + otherHalfHeight); // Bottom
      
      guides.vertical.push(other.position.x - otherHalfWidth); // Left
      guides.vertical.push(other.position.x + otherHalfWidth); // Right
    }
    
    return guides;
  }
  
  /**
   * Snap an element to the nearest guide
   */
  snapToGuides(
    element: CardElement, 
    allElements: CardElement[],
    threshold = 5
  ): CardElement {
    const guides = this.getAlignmentGuides(element, allElements, threshold);
    let position = { ...element.position };
    
    // Snap to horizontal guides
    for (const guide of guides.horizontal) {
      if (Math.abs(position.y - guide) <= threshold) {
        position.y = guide;
        break;
      }
    }
    
    // Snap to vertical guides
    for (const guide of guides.vertical) {
      if (Math.abs(position.x - guide) <= threshold) {
        position.x = guide;
        break;
      }
    }
    
    return {
      ...element,
      position
    };
  }
}

// Export a singleton instance
export const placementEngine = new PlacementEngine();
