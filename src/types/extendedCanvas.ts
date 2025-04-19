
// Extended HTMLCanvasElement with additional properties for image editing
export interface ExtendedCanvas extends HTMLCanvasElement {
  file?: File;
  url?: string;
  metadata?: any;
}

// Helper function to type cast a canvas to ExtendedCanvas
export function asExtendedCanvas(canvas: HTMLCanvasElement): ExtendedCanvas {
  return canvas as ExtendedCanvas;
}

// Type guard to check if a canvas is an ExtendedCanvas
export function isExtendedCanvas(canvas: HTMLCanvasElement): canvas is ExtendedCanvas {
  return 'file' in canvas || 'url' in canvas || 'metadata' in canvas;
}
