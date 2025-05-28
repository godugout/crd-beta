
export interface ElementPosition {
  x: number;
  y: number;
  z: number;
}

export interface ElementTransform {
  translateX: number;
  translateY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  scale: number;
}

export interface ElementUploadMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  isAnimated: boolean;
  category: string;
  type: string;
}

export type ElementType = 'image' | 'text' | 'shape' | 'effect' | 'sticker';

export interface CardElement {
  id: string;
  type: ElementType;
  name: string;
  url: string;
  assetUrl: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  category: string;
  isOfficial: boolean;
  position: ElementPosition;
  transform: ElementTransform;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}
