
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown' | 'group';

export interface EnhancedCropBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

export interface DetectedMetadata {
  text: string;
  title?: string;
  player?: string;
  team?: string;
  year?: string;
  tags: string[];
  position?: string;
  sport?: string;
  manufacturer?: string;
  condition?: string;
  cardNumber?: string;
  setName?: string;
  confidence?: number;
}
