
export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number | string;
  height: number | string;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape';
  content: string | object;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  visible: boolean;
  effectIds: string[];
}
